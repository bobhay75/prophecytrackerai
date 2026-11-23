import http.cookiejar
import json
import pathlib
import urllib.error
import urllib.request
from harness import seed, server

checks = 0
def check(value, description):
    global checks
    checks += 1
    assert value, description

class Client:
    def __init__(self, origin):
        self.origin = origin
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
        self.csrf = ""
    def call(self, action, data=None, headers=None, method=None):
        h = {"Origin": self.origin}
        if data is not None:
            h.update({"Content-Type": "application/json", "X-CSRF-Token": self.csrf})
        h.update(headers or {})
        req = urllib.request.Request(self.origin + "/prophecy/api/index.php?action=" + action, data=None if data is None else json.dumps(data).encode(), headers=h, method=method)
        try:
            response = self.opener.open(req, timeout=10)
        except urllib.error.HTTPError as error:
            response = error
        result = json.loads(response.read())
        if "csrf" in result:
            self.csrf = result["csrf"]
        return response.status, result, response.headers

with server(base="/prophecy") as host:
    a = Client(host["origin"])
    status, session, headers = a.call("session")
    check(status == 200 and len(a.csrf) == 64 and session["user"] is None, "anonymous CSRF session")
    check("no-store" in headers["Cache-Control"] and headers["X-Content-Type-Options"] == "nosniff", "private response headers")
    cookies = list(a.jar)
    check(len(cookies) == 1 and cookies[0].path == "/prophecy/" and cookies[0].has_nonstandard_attr("HttpOnly"), "HttpOnly subdirectory session cookie")
    check("SameSite=Lax" in headers["Set-Cookie"], "SameSite cookie")
    check(a.call("register", {"username": "httpalice", "password": "correct horse battery staple"}, {"X-CSRF-Token": "bad"})[0] == 403, "CSRF prevents signup")
    check(a.call("register", {"username": "httpalice", "password": "correct horse battery staple"}, {"Origin": "https://evil.invalid"})[0] == 403, "origin prevents signup")
    check(a.call("session", headers={"Sec-Fetch-Site": "cross-site"})[0] == 403, "cross-site API request rejected")
    check(a.call("session", headers={"Host": "evil.invalid"})[0] == 400, "Host spoof rejected")
    check(a.call("rules")[0] == 401, "anonymous private data denied")
    old_csrf = a.csrf
    status, registration, _ = a.call("register", {"username": "httpalice", "password": "correct horse battery staple"})
    check(status == 200 and a.csrf != old_csrf, "signup creates account and rotates CSRF")
    code = registration["recovery_code"]
    check(a.call("save-rule", {"label": "Missouri", "minimum": 4.5, "location": "Missouri", "enabled": True}, {"X-CSRF-Token": old_csrf})[0] == 403, "old CSRF rejected after authentication")
    status, rules, _ = a.call("save-rule", {"label": "Missouri", "minimum": 4.5, "location": "Missouri", "enabled": True})
    check(status == 200 and len(rules["rules"]) == 1, "save real persisted rule")
    seed(host["private"])
    check(a.call("evaluate", {})[1]["new_alerts"] == 1, "fresh source matching through HTTP")
    check(a.call("evaluate", {})[1]["new_alerts"] == 0, "HTTP replay does not duplicate alerts")
    status, alerts, headers = a.call("alerts")
    check(status == 200 and len(alerts["alerts"]) == 1 and "no-store" in headers["Cache-Control"], "private persisted alert inbox")
    check(a.call("analyze", {"minimum": 4.5, "location": "Missouri", "mode": "scenario"})[1]["report"]["observed_count"] == 2, "source scenario through HTTP")
    check(a.call("analyze", {"mode": "ai"})[1]["code"] == "ai_disabled", "unconfigured AI explicit failure")
    check(a.call("create-order", {})[1]["code"] == "checkout_disabled", "unconfigured checkout cannot charge")
    check(a.call("capture-order", method="GET")[0] == 405, "GET cannot capture payment")
    b = Client(host["origin"])
    b.call("session")
    b.call("register", {"username": "httpbob", "password": "another correct horse battery"})
    check(b.call("alerts")[1]["alerts"] == [], "second account sees no first-account alerts")
    check(b.call("delete-rule", {"id": rules["rules"][0]["id"]})[0] == 404, "cross-account rule deletion denied")
    second = Client(host["origin"])
    second.call("session")
    check(second.call("login", {"username": "httpalice", "password": "correct horse battery staple"})[0] == 200, "second device login")
    check(a.call("change-password", {"old_password": "correct horse battery staple", "password": "new correct horse battery"})[0] == 200, "password change through API")
    check(second.call("rules")[0] == 401, "password change revokes another active device session")
    check(a.call("export")[1]["export"]["rules"][0]["label"] == "Missouri", "account data export")
    a.call("logout", {})
    check(a.call("alerts")[0] == 401, "logout removes access")
    a.call("session")
    status, recovered, _ = a.call("recover", {"username": "httpalice", "recovery_code": code, "password": "recovered correct horse pass"})
    check(status == 200 and recovered["recovery_code"] != code, "recovery rotates one-time code")
    check(a.call("recover", {"username": "httpalice", "recovery_code": code, "password": "should not work password"})[0] == 401, "used recovery code rejected")
    check(a.call("delete-account", {"password": "wrong"})[0] == 401, "deletion requires current password")
    check(a.call("delete-account", {"password": "recovered correct horse pass"})[0] == 200, "authenticated account deletion")
    check(a.call("session")[1]["user"] is None, "deleted account no longer authenticated")
    check(b.call("session")[1]["user"]["username"] == "httpbob", "other account survives deletion")
    config = pathlib.Path(host["private"]) / "config.local.php"
    config.write_text("<?php return ['origin'=>'https://127.0.0.1:"+str(host["port"])+"','base_path'=>'/prophecy'];")
    check(b.call("session", headers={"Origin": "https://127.0.0.1:"+str(host["port"]), "X-Forwarded-Proto": "https"})[0] == 426, "production refuses HTTP and untrusted forwarded headers")
print(f"PASS: {checks} native HTTP account, session, CSRF, ownership, recovery, alert, report and disabled-provider assertions.")
