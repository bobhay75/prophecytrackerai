import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Search, Clock, Star, Globe, Crown } from 'lucide-react';

interface PropheticText {
  id: string;
  title: string;
  category: 'biblical' | 'historical' | 'prophecy' | 'commentary';
  testament?: 'old' | 'new';
  book?: string;
  chapter?: number;
  verses?: string;
  content: string;
  keyThemes: string[];
  prophecyType?: 'fulfilled' | 'ongoing' | 'future';
  historicalContext?: string;
  modernRelevance?: string;
}

export function PropheticLibrary() {
  const [selectedTab, setSelectedTab] = useState('biblical');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedText, setSelectedText] = useState<PropheticText | null>(null);

  const prophecticTexts: PropheticText[] = [
    // Biblical Prophecies
    {
      id: 'daniel-2',
      title: 'Daniel\'s Vision of World Empires',
      category: 'biblical',
      testament: 'old',
      book: 'Daniel',
      chapter: 2,
      verses: '31-45',
      content: `You, O king, saw, and behold a great image. This great image, whose brightness was excellent, stood before you; and the form thereof was terrible. This image's head was of fine gold, his breast and his arms of silver, his belly and his thighs of brass, His legs of iron, his feet part of iron and part of clay.

You saw till that a stone was cut out without hands, which struck the image upon his feet that were of iron and clay, and broke them to pieces. Then was the iron, the clay, the brass, the silver, and the gold, broken to pieces together, and became like the chaff of the summer threshingfloors; and the wind carried them away, that no place was found for them: and the stone that struck the image became a great mountain, and filled the whole earth.`,
      keyThemes: ['World Empires', 'End Times', 'Kingdom of God', 'Babylonian Empire'],
      prophecyType: 'ongoing',
      historicalContext: 'Given during Babylonian captivity around 603 BC to King Nebuchadnezzar',
      modernRelevance: 'Many scholars see this as describing successive world empires leading to the establishment of God\'s eternal kingdom'
    },
    {
      id: 'matthew-24',
      title: 'Signs of the End Times',
      category: 'biblical',
      testament: 'new',
      book: 'Matthew',
      chapter: 24,
      verses: '3-14',
      content: `And as he sat upon the mount of Olives, the disciples came unto him privately, saying, Tell us, when shall these things be? and what shall be the sign of thy coming, and of the end of the world?

And Jesus answered and said unto them, Take heed that no man deceive you. For many shall come in my name, saying, I am Christ; and shall deceive many. And ye shall hear of wars and rumours of wars: see that ye be not troubled: for all these things must come to pass, but the end is not yet.

For nation shall rise against nation, and kingdom against kingdom: and there shall be famines, and pestilences, and earthquakes, in divers places. All these are the beginning of sorrows.`,
      keyThemes: ['Second Coming', 'False Messiahs', 'Wars', 'Natural Disasters', 'End Times Signs'],
      prophecyType: 'ongoing',
      historicalContext: 'Jesus speaking to disciples on Mount of Olives, circa 30-33 AD',
      modernRelevance: 'Current global conflicts, earthquakes, and pandemics seen as fulfillment of these prophecies'
    },
    {
      id: 'revelation-8',
      title: 'The Third Trumpet - Wormwood',
      category: 'biblical',
      testament: 'new',
      book: 'Revelation',
      chapter: 8,
      verses: '10-11',
      content: `And the third angel sounded, and there fell a great star from heaven, burning as it were a lamp, and it fell upon the third part of the rivers, and upon the fountains of waters; And the name of the star is called Wormwood: and the third part of the waters became wormwood; and many men died of the waters, because they were made bitter.`,
      keyThemes: ['Cosmic Judgment', 'Water Contamination', 'Celestial Events', 'Third Trumpet'],
      prophecyType: 'future',
      historicalContext: 'Written by Apostle John on Patmos, circa 95 AD',
      modernRelevance: 'Space weather monitoring focuses on asteroid and comet impacts that could fulfill this prophecy'
    },
    {
      id: 'ezekiel-38',
      title: 'The Gog and Magog War',
      category: 'biblical',
      testament: 'old',
      book: 'Ezekiel',
      chapter: 38,
      verses: '1-6',
      content: `And the word of the LORD came unto me, saying, Son of man, set thy face against Gog, the land of Magog, the chief prince of Meshech and Tubal, and prophesy against him, And say, Thus saith the Lord GOD; Behold, I am against thee, O Gog, the chief prince of Meshech and Tubal: And I will turn thee back, and put hooks into thy jaws, and I will bring thee forth, and all thine army, horses and horsemen, all of them clothed with all sorts of armour, even a great company with bucklers and shields, all of them handling swords: Persia, Ethiopia, and Libya with them; all of them with shield and helmet: Gomer, and all his bands; the house of Togarmah of the north quarters, and all his bands: and many people with thee.`,
      keyThemes: ['End Times War', 'Israel\'s Enemies', 'Divine Judgment', 'Northern Alliance'],
      prophecyType: 'future',
      historicalContext: 'Written during Babylonian exile, circa 593-571 BC',
      modernRelevance: 'Many see this as describing a future coalition against Israel, possibly involving Russia and Middle Eastern nations'
    },
    
    // Historical Prophecies
    {
      id: 'isaiah-53',
      title: 'The Suffering Servant',
      category: 'biblical',
      testament: 'old',
      book: 'Isaiah',
      chapter: 53,
      verses: '3-7',
      content: `He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not. Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed. All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all. He was oppressed, and he was afflicted, yet he opened not his mouth: he is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb, so he openeth not his mouth.`,
      keyThemes: ['Messiah', 'Suffering', 'Atonement', 'Vicarious Death'],
      prophecyType: 'fulfilled',
      historicalContext: 'Written by Isaiah around 700 BC, centuries before Christ',
      modernRelevance: 'Considered one of the most detailed prophecies about Jesus Christ\'s crucifixion'
    },
    {
      id: 'daniel-9',
      title: 'The Seventy Weeks',
      category: 'biblical',
      testament: 'old',
      book: 'Daniel',
      chapter: 9,
      verses: '24-27',
      content: `Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity, and to bring in everlasting righteousness, and to seal up the vision and prophecy, and to anoint the most Holy. Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks: the street shall be built again, and the wall, even in troublous times. And after threescore and two weeks shall Messiah be cut off, but not for himself: and the people of the prince that shall come shall destroy the city and the sanctuary; and the end thereof shall be with a flood, and unto the end of the war desolations are determined.`,
      keyThemes: ['Messiah\'s Coming', 'Jerusalem\'s Restoration', 'Prophetic Timeline', 'Temple Destruction'],
      prophecyType: 'fulfilled',
      historicalContext: 'Given to Daniel during Babylonian captivity, circa 539 BC',
      modernRelevance: 'Precisely predicted the timing of Messiah\'s first coming and Jerusalem\'s destruction in 70 AD'
    },

    // Commentary and Analysis
    {
      id: 'end-times-timeline',
      title: 'Understanding End Times Chronology',
      category: 'commentary',
      content: `The biblical timeline of end times events provides a framework for understanding current global developments. Key markers include:

**The Beginning of Sorrows (Matthew 24:8)**
- Increase in wars, famines, earthquakes, and pestilences
- Rise of false messiahs and prophets
- Gospel preached to all nations

**The Great Tribulation**
- Seven-year period of unprecedented global turmoil
- Antichrist's rise to power
- Persecution of believers
- Divine judgments described in Revelation

**The Second Coming**
- Christ's return in power and glory
- Battle of Armageddon
- Judgment of nations
- Establishment of Millennial Kingdom

**Modern Implications:**
Current global events including pandemic responses, economic instability, technological surveillance, and Middle East tensions may be setting the stage for these prophetic fulfillments.`,
      keyThemes: ['Chronology', 'Tribulation', 'Second Coming', 'Modern Events'],
      prophecyType: 'ongoing',
      modernRelevance: 'Provides framework for understanding current global developments in prophetic context'
    },
    {
      id: 'technology-prophecy',
      title: 'Technology and End Times Prophecy',
      category: 'commentary',
      content: `Biblical prophecy anticipated technological developments that enable end times events:

**Global Communication (Revelation 11:9-10)**
"And they of the people and kindreds and tongues and nations shall see their dead bodies three days and an half, and shall not suffer their dead bodies to be put in graves."
- Describes worldwide simultaneous viewing, fulfilled through satellite TV and internet

**Mark of the Beast System (Revelation 13:16-17)**
Digital currencies, biometric identification, and social credit systems provide the technological infrastructure for the prophesied economic control system.

**Image of the Beast (Revelation 13:15)**
Artificial intelligence and holographic technology could enable the creation of a speaking, seemingly living image.

**Current Developments:**
- Central Bank Digital Currencies (CBDCs)
- Biometric ID systems
- Social credit scoring
- AI and virtual reality advancement
- Global surveillance networks

These technologies, while beneficial in many ways, also create the infrastructure necessary for the fulfillment of end times prophecies regarding global control and the mark of the beast system.`,
      keyThemes: ['Technology', 'Mark of Beast', 'Global Control', 'Digital Currency'],
      prophecyType: 'ongoing',
      modernRelevance: 'Current technological developments align with prophetic descriptions of end times control systems'
    }
  ];

  const filteredTexts = prophecticTexts.filter(text => {
    if (!searchQuery) return selectedTab === 'all' || text.category === selectedTab;
    const matchesSearch = text.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         text.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         text.keyThemes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = selectedTab === 'all' || text.category === selectedTab;
    return matchesSearch && matchesTab;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'biblical': return <BookOpen className="h-4 w-4" />;
      case 'historical': return <Clock className="h-4 w-4" />;
      case 'prophecy': return <Star className="h-4 w-4" />;
      case 'commentary': return <Globe className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTestamentBadge = (testament?: string) => {
    if (!testament) return null;
    return (
      <Badge variant="outline" className={`text-xs ${
        testament === 'old' ? 'text-amber-700 border-amber-300' : 'text-blue-700 border-blue-300'
      }`}>
        {testament === 'old' ? 'Old Testament' : 'New Testament'}
      </Badge>
    );
  };

  const getProphecyTypeBadge = (type?: string) => {
    if (!type) return null;
    const colors = {
      fulfilled: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      future: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.future}>
        {type?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Prophetic & Historical Library</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search prophecies, themes, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="biblical">📖 Biblical</TabsTrigger>
              <TabsTrigger value="historical">🏛️ Historical</TabsTrigger>
              <TabsTrigger value="prophecy">🔮 Prophecy</TabsTrigger>
              <TabsTrigger value="commentary">💭 Commentary</TabsTrigger>
            </TabsList>

            <TabsContent value="biblical" className="mt-6">
              <div className="grid gap-4">
                {filteredTexts.filter(text => text.category === 'biblical').map((text) => (
                  <Card key={text.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => setSelectedText(text)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(text.category)}
                          <h4 className="font-semibold">{text.title}</h4>
                        </div>
                        <div className="flex space-x-2">
                          {getTestamentBadge(text.testament)}
                          {getProphecyTypeBadge(text.prophecyType)}
                        </div>
                      </div>
                      {text.book && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {text.book} {text.chapter}:{text.verses}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {text.content.substring(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {text.keyThemes.slice(0, 3).map((theme) => (
                          <Badge key={theme} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="historical" className="mt-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Historical prophecies and their fulfillments
                </p>
                <div className="grid gap-4 max-w-2xl mx-auto">
                  {filteredTexts.filter(text => text.prophecyType === 'fulfilled').map((text) => (
                    <Card key={text.id} className="cursor-pointer hover:shadow-md transition-shadow text-left" 
                          onClick={() => setSelectedText(text)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{text.title}</h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            FULFILLED
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {text.book} {text.chapter}:{text.verses}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {text.historicalContext}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prophecy" className="mt-6">
              <div className="grid gap-4">
                {filteredTexts.filter(text => text.prophecyType === 'future' || text.prophecyType === 'ongoing').map((text) => (
                  <Card key={text.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => setSelectedText(text)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4" />
                          <h4 className="font-semibold">{text.title}</h4>
                        </div>
                        {getProphecyTypeBadge(text.prophecyType)}
                      </div>
                      {text.book && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {text.book} {text.chapter}:{text.verses}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {text.modernRelevance}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {text.keyThemes.map((theme) => (
                          <Badge key={theme} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="commentary" className="mt-6">
              <div className="grid gap-4">
                {filteredTexts.filter(text => text.category === 'commentary').map((text) => (
                  <Card key={text.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => setSelectedText(text)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <h4 className="font-semibold">{text.title}</h4>
                        </div>
                        <Badge variant="outline">Analysis</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                        {text.content.substring(0, 200)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {text.keyThemes.map((theme) => (
                          <Badge key={theme} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Text Modal/Detail View */}
      {selectedText && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getCategoryIcon(selectedText.category)}
                  <span>{selectedText.title}</span>
                </CardTitle>
                {selectedText.book && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {selectedText.book} {selectedText.chapter}:{selectedText.verses}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedText(null)}>
                ✕
              </Button>
            </div>
            <div className="flex space-x-2">
              {getTestamentBadge(selectedText.testament)}
              {getProphecyTypeBadge(selectedText.prophecyType)}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 mb-4">
              <div className="pr-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedText.content}
                </p>
              </div>
            </ScrollArea>
            
            {selectedText.historicalContext && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Historical Context</h5>
                <p className="text-sm text-amber-700 dark:text-amber-300">{selectedText.historicalContext}</p>
              </div>
            )}
            
            {selectedText.modernRelevance && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Modern Relevance</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">{selectedText.modernRelevance}</p>
              </div>
            )}
            
            <div>
              <h5 className="font-semibold mb-2">Key Themes</h5>
              <div className="flex flex-wrap gap-2">
                {selectedText.keyThemes.map((theme) => (
                  <Badge key={theme} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}