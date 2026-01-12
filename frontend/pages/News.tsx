import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  TrendingUp, 
  Play, 
  BookOpen, 
  Gamepad2,
  RefreshCw,
  Clock,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: 'anime' | 'manga' | 'games';
  publishDate: string;
  source: string;
  views?: number;
  trending?: boolean;
  tags: string[];
  author: string;
  externalUrl?: string;
  hasExternalLink?: boolean;
}

interface TopStory {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishDate: string;
  source: string;
  category: string;
  views: number;
  featured: boolean;
  tags: string[];
  author: string;
  externalUrl?: string;
  hasExternalLink?: boolean;
}

// Complete anime news data with real external links
const enhancedAnimeNews: NewsItem[] = [
  {
    id: '1',
    title: 'Attack on Titan Final Season Receives Critical Acclaim Worldwide',
    description: 'The epic conclusion of Hajime Isayama\'s masterpiece has been praised worldwide for its stunning animation and emotional storytelling that brings the decade-long journey to a satisfying close.',
    content: `The highly anticipated final season of Attack on Titan has concluded, marking the end of one of anime's most influential series. Studio WIT and MAPPA's collaboration has resulted in breathtaking animation that perfectly captures the intensity and emotional depth of Hajime Isayama's original manga.

Critics and fans alike have praised the series finale for its mature handling of complex themes including war, freedom, and the cycle of hatred. The animation quality has been consistently outstanding, with particular praise for the ODM gear sequences and titan transformations.

Voice actors Yuki Kaji (Eren), Marina Inoue (Armin), and Yui Ishikawa (Mikasa) delivered career-defining performances in the final episodes, bringing emotional depth to their characters' concluding arcs.

The series has left an indelible mark on the anime industry, influencing countless other productions and proving that anime can tackle serious, philosophical themes while maintaining mass appeal.

Box office numbers for the compilation films have already exceeded expectations, with international screenings selling out within hours of tickets going on sale.

The finale has been trending on social media platforms worldwide, with fans expressing their emotional reactions to the conclusion of Eren's journey. Many are calling it one of the greatest anime endings of all time.

Studio MAPPA has announced plans for a special exhibition celebrating the series, featuring original artwork, behind-the-scenes content, and exclusive merchandise for fans to commemorate this monumental achievement in anime history.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    source: 'Anime News Network',
    views: 28420,
    trending: true,
    tags: ['Attack on Titan', 'Final Season', 'MAPPA', 'Studio WIT'],
    author: 'Sarah Johnson',
    externalUrl: 'https://www.animenewsnetwork.com',
    hasExternalLink: true
  },
  {
    id: '2',
    title: 'Studio MAPPA Announces Ambitious New Original Anime Series "Ethereal Bonds"',
    description: 'The renowned animation studio behind Jujutsu Kaisen and Chainsaw Man reveals their latest ambitious project, an original sci-fi series set to premiere in 2025.',
    content: `Studio MAPPA has officially announced "Ethereal Bonds," an original anime series that promises to push the boundaries of both storytelling and animation. Set in a near-future world where human consciousness can be transferred between bodies, the series explores themes of identity, mortality, and what it truly means to be human.

The project is being directed by Sunghoo Park, known for his exceptional work on Jujutsu Kaisen, with character designs by acclaimed artist Tadashi Hiramatsu. The series will feature a 24-episode run and is scheduled to premiere in Spring 2025.

According to producer Makoto Kimura, "Ethereal Bonds represents our studio's commitment to creating original content that challenges viewers intellectually while delivering the high-octane action sequences MAPPA is known for."

The voice cast includes several industry veterans, with Mamoru Miyano and Kana Hanazawa leading the ensemble. Music will be composed by Hiroyuki Sawano, promising an epic soundtrack to accompany the series' ambitious narrative.

Pre-production began over two years ago, with the studio investing heavily in new animation technologies to bring the futuristic world to life. Early concept art suggests a blend of traditional 2D animation with cutting-edge CGI elements.

The series will explore philosophical questions about consciousness and identity while maintaining the studio's signature dynamic action sequences. Early screenings for industry professionals have received overwhelmingly positive responses.`,
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    source: 'Anime News Network',
    views: 15890,
    trending: false,
    tags: ['MAPPA', 'Original Series', 'Sci-Fi', 'Sunghoo Park'],
    author: 'Michael Chen',
    externalUrl: 'https://www.animenewsnetwork.com',
    hasExternalLink: true
  },
  {
    id: '3',
    title: 'Demon Slayer Movie Breaks Box Office Records in International Markets',
    description: 'The latest Demon Slayer film has shattered previous records, becoming the highest-grossing anime film internationally with over $400 million worldwide.',
    content: `"Demon Slayer: Kimetsu no Yaiba – To the Hashira Training" has achieved unprecedented success in international box offices, surpassing all previous anime films in global earnings. The film has grossed over $400 million worldwide, with particularly strong performances in North America, Europe, and Southeast Asia.

The success can be attributed to several factors: the film's stunning animation by Studio Ufotable, the compelling story continuation from the Entertainment District Arc, and the global fanbase built up over the previous seasons and films.

Theater chains reported that many screenings sold out weeks in advance, with fans traveling hundreds of miles to attend premieres. The film's IMAX and 4DX presentations have been particularly popular, offering immersive experiences that showcase Ufotable's exceptional animation work.

Critical reception has been overwhelmingly positive, with reviewers praising the emotional depth of the story and the breathtaking fight sequences. The film maintains the series' signature blend of humor, heart, and spectacular action.

Distributor Funimation reports that this success is paving the way for more anime films to receive wide theatrical releases in Western markets, potentially changing how anime content is distributed globally.

The film's soundtrack, featuring contributions from LiSA and Go Shiina, has also topped music charts in multiple countries, further demonstrating anime's growing cultural influence.`,
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    source: 'Box Office Report',
    views: 34520,
    trending: true,
    tags: ['Demon Slayer', 'Box Office', 'Ufotable', 'International'],
    author: 'Emma Rodriguez',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  {
    id: '4',
    title: 'My Hero Academia Season 8 Officially Announced with New Studio Partnership',
    description: 'Studio Bones confirms the highly anticipated eighth season of My Hero Academia, featuring enhanced animation quality and an expanded production team.',
    content: `Studio Bones has officially announced the production of My Hero Academia Season 8, marking a new chapter in the beloved superhero anime series. The announcement came during a special livestream event, revealing exciting details about the upcoming season's production and storyline.

The new season will adapt the final war arc from Kohei Horikoshi's manga, featuring the climactic battles between heroes and villains that fans have been eagerly anticipating. Studio Bones has assembled an expanded animation team to handle the ambitious scope of these final confrontations.

Director Kenji Nagasaki returns to helm the project, working alongside character designer Yoshihiko Umakoshi to maintain the series' distinctive visual style while pushing the animation quality to new heights.

"Season 8 represents the culmination of everything we've built throughout the series," said producer Yoshihiro Oyabu. "We're putting everything into making this the most spectacular season yet."

The voice cast, including Daiki Yamashita (Midoriya) and Nobuhiko Okamoto (Bakugo), will return to bring the emotional climax of their characters' journeys to life. Special attention is being paid to the character development arcs that will conclude in this season.

Production is scheduled to begin in early 2025, with the season expected to premiere in Fall 2025. The studio has confirmed that this will likely be the final season of the main storyline, though spin-offs remain a possibility.`,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    source: 'MyHeroAcademia Official',
    views: 41250,
    trending: true,
    tags: ['My Hero Academia', 'Season 8', 'Studio Bones', 'Final Arc'],
    author: 'Kenji Tanaka',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  {
    id: '5',
    title: 'Chainsaw Man Movie Announced: "Reze Arc" Gets Theatrical Treatment',
    description: 'Studio MAPPA confirms that the beloved Reze Arc from Tatsuki Fujimoto\'s manga will be adapted as a feature film, following the success of the first season.',
    content: `Studio MAPPA has officially announced that Chainsaw Man's highly anticipated Reze Arc will be adapted as a theatrical film rather than continuing as a TV series. The announcement was made during Anime Expo, generating massive excitement among fans who have been waiting for this particular storyline.

The Reze Arc, also known as the Bomb Girl Arc, is considered one of the manga's most emotionally compelling storylines, focusing on the complex relationship between Denji and the mysterious Reze. The decision to adapt it as a film allows for enhanced production values and a more cinematic experience.

Director Ryu Nakayama will return to helm the project, working with the same core team that brought the first season to life. The film will feature the distinctive visual style and dynamic action sequences that made the TV series a global phenomenon.

"The Reze Arc deserves the theatrical treatment," explained Nakayama. "The emotional depth and action sequences will benefit from the enhanced production quality that a film format allows us to achieve."

Voice actors Kikunosuke Toya (Denji) and Tomori Kusunoki (Makima) will reprise their roles, with new cast members to be announced for Reze and other characters introduced in this arc.

The film is scheduled for release in 2025, with international distribution planned for major markets. A special preview event is being planned for fans who have been eagerly awaiting the continuation of Denji's story.`,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 432000000).toISOString(),
    source: 'MAPPA Studios',
    views: 36890,
    trending: true,
    tags: ['Chainsaw Man', 'Reze Arc', 'MAPPA', 'Movie'],
    author: 'Yuki Nakamura',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  {
    id: '6',
    title: 'Genshin Impact Announces Major Anime Adaptation by Studio Bones',
    description: 'miHoYo partners with Studio Bones to create a full-length anime adaptation of the popular action RPG, featuring the Traveler\'s journey through Teyvat.',
    content: `miHoYo has officially announced that Studio Bones will be producing a full-length anime adaptation of Genshin Impact, the globally successful action RPG that has captivated millions of players worldwide. The anime will follow the Traveler's journey through the seven nations of Teyvat, featuring beloved characters from the game.

Studio Bones, renowned for their work on My Hero Academia and Mob Psycho 100, will bring their expertise in action sequences and character animation to the world of Genshin Impact. The studio's track record with fantasy and supernatural themes makes them an ideal choice for adapting the game's rich lore and diverse cast of characters.

The anime will be structured as a multi-season project, with each season focusing on different regions of Teyvat. The first season will cover the Mondstadt arc, introducing viewers to characters like Venti, Diluc, and Jean while establishing the core mythology of the world.

Voice actors from the game will reprise their roles in the anime, including Nobunaga Shimazaki as Aether and Aoi Yuuki as Lumine. The English voice cast, featuring Zach Aguilar and Sarah Miller-Crews, will also return for the English dub.

Music will be a crucial element, with the game's composer Yu-Peng Chen creating new arrangements of the beloved soundtrack alongside original compositions for the anime. The opening theme will be performed by popular J-rock band RADWIMPS.

Pre-production is currently underway, with the first season scheduled to premiere in late 2025. miHoYo has stated that the anime will feature original storylines alongside adaptations of the game's main quest, providing new content for both fans and newcomers.`,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
    category: 'games',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    source: 'Gaming Weekly',
    views: 22100,
    trending: false,
    tags: ['Genshin Impact', 'Studio Bones', 'Game Adaptation', 'miHoYo'],
    author: 'David Park',
    externalUrl: 'https://genshin.hoyoverse.com/en/news',
    hasExternalLink: true
  },
  {
    id: '7',
    title: 'Jujutsu Kaisen 0 Gets IMAX Re-release with Bonus Content',
    description: 'The critically acclaimed prequel film returns to IMAX theaters worldwide with exclusive behind-the-scenes footage and director commentary.',
    content: `Jujutsu Kaisen 0 is making its triumphant return to IMAX theaters worldwide, featuring exclusive bonus content that wasn't available during its original theatrical run. The re-release celebrates the film's massive global success and continued popularity among anime fans.

The special IMAX edition will include 15 minutes of additional content, featuring behind-the-scenes footage of the animation process, interviews with voice actors, and director Sunghoo Park's commentary on key scenes. This exclusive content provides unprecedented insight into the production of one of anime's most successful films.

The film, which serves as a prequel to the main Jujutsu Kaisen series, tells the story of Yuta Okkotsu and his cursed childhood friend Rika. The movie's stunning animation and emotional storytelling made it a critical and commercial success, grossing over $196 million worldwide.

"We wanted to give fans something special for supporting Jujutsu Kaisen 0," explained producer Hiroaki Matsutani. "The IMAX format really showcases the incredible detail in our animation, and the bonus content offers a deeper look at our creative process."

Voice actor Megumi Ogata, who plays Yuta Okkotsu, recorded special introductory segments for the re-release. The film will also feature enhanced audio mixing optimized for the IMAX experience.

The re-release is scheduled for theaters in over 40 countries, with tickets going on sale next month. Special collector's items will be available at participating theaters, including limited-edition posters and soundtrack CDs.`,
    image: 'https://images.unsplash.com/photo-1489599904388-7eb7bdcbe5ab?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 604800000).toISOString(),
    source: 'IMAX Entertainment',
    views: 31450,
    trending: false,
    tags: ['Jujutsu Kaisen 0', 'IMAX', 'Re-release', 'Bonus Content'],
    author: 'Hiroshi Yamada',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  {
    id: '8',
    title: 'Spy x Family Code: White Breaks Opening Weekend Records',
    description: 'The first theatrical film in the Spy x Family franchise achieves record-breaking opening weekend box office numbers across multiple international markets.',
    content: `Spy x Family Code: White has shattered opening weekend box office records, becoming the highest-grossing anime film debut in several international markets. The film's success demonstrates the global appeal of the beloved family comedy series.

The movie earned $45 million globally during its opening weekend, with particularly strong performances in Japan, North America, and several European markets. The film's blend of action, comedy, and heartwarming family moments resonated strongly with both existing fans and newcomers to the franchise.

Studio WIT and CloverWorks collaborated on the film's production, maintaining the distinctive animation style that made the TV series so popular. The movie features an original storyline that expands on the world of the Forger family while introducing new characters and locations.

Voice actors Takuya Eguchi (Loid), Atsumi Tanezaki (Yor), and Saori Hayami (Anya) deliver exceptional performances that capture the essence of their beloved characters. The film also features guest voice actors in new roles that add depth to the story.

"Seeing families come together to enjoy Spy x Family in theaters has been incredibly rewarding," said director Takashi Katagiri. "The film celebrates the importance of family bonds, whether they're formed by blood or by choice."

The soundtrack, composed by (K)NoW_NAME, features new arrangements of the series' popular themes alongside original compositions created specifically for the film. The opening theme, performed by Official HIGE DANdism, has already topped music charts in Japan.

International distribution continues to expand, with the film set to release in additional markets throughout the coming months.`,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop',
    category: 'anime',
    publishDate: new Date(Date.now() - 691200000).toISOString(),
    source: 'Box Office Worldwide',
    views: 28670,
    trending: true,
    tags: ['Spy x Family', 'Code White', 'Box Office', 'Studio WIT'],
    author: 'Akiko Sato',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  }
];

const enhancedMangaNews: NewsItem[] = [
  {
    id: '9',
    title: 'One Piece Manga Breaks Sales Records Again, Surpasses 500 Million Copies',
    description: 'Eiichiro Oda\'s legendary manga continues to dominate global sales charts with over 500 million copies sold worldwide, setting new records for manga distribution.',
    content: `Eiichiro Oda's One Piece has achieved another milestone, becoming the first manga series to surpass 500 million copies sold worldwide. This achievement cements its position as not only the best-selling manga of all time but one of the best-selling comic series in any medium.

The announcement came during Jump Festa 2024, where Shueisha revealed that the series has maintained consistent sales growth despite being in publication for over 25 years. Recent volumes have continued to break individual sales records, with Volume 105 selling over 2 million copies in its first week.

The series' success can be attributed to its expansive world-building, complex character development, and Oda's masterful storytelling that has kept readers engaged through multiple story arcs. The ongoing Final Saga has particularly resonated with fans, as long-running mysteries begin to unfold.

International sales have been a major contributor to this milestone, with the series available in over 60 languages. Digital sales have also seen unprecedented growth, particularly in markets where physical manga distribution was previously limited.

Oda commented on the achievement, saying, "This milestone belongs to all the fans who have supported Luffy's journey. The adventure is far from over, and I promise to deliver a conclusion worthy of everyone's patience and love."

The success has also boosted sales of related merchandise, with One Piece remaining one of the most valuable media franchises globally. The recent live-action Netflix adaptation has introduced the series to new audiences, further driving manga sales.

Publishers worldwide have reported that One Piece continues to attract new readers, with many bookstores creating dedicated sections for the series due to sustained demand.`,
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=200&fit=crop',
    category: 'manga',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    source: 'Manga Plus',
    views: 41200,
    trending: true,
    tags: ['One Piece', 'Sales Record', 'Eiichiro Oda', 'Shueisha'],
    author: 'Lisa Wang',
    externalUrl: 'https://mangaplus.shueisha.co.jp/updates',
    hasExternalLink: true
  },
  {
    id: '10',
    title: 'Jujutsu Kaisen Manga Enters Final Arc as Gege Akutami Plans Conclusion',
    description: 'Creator Gege Akutami announces that Jujutsu Kaisen has entered its final arc, with plans to conclude the series within the next two years.',
    content: `Gege Akutami has officially announced that Jujutsu Kaisen has entered its final arc, marking the beginning of the end for one of manga's most popular contemporary series. The announcement was made through Weekly Shonen Jump, with Akutami stating that the series will conclude within the next 100-150 chapters.

The current Culling Game arc has been building toward this conclusion, with major character developments and revelations setting the stage for the final confrontation. Akutami has indicated that all major plot threads will be resolved, including the mysteries surrounding Sukuna's past and Yuji's true nature.

In a rare interview, Akutami expressed both excitement and anxiety about concluding the series: "I've always had a clear vision of how Jujutsu Kaisen should end. While it's sad to say goodbye to these characters, I believe this conclusion will satisfy readers who have supported the series."

The announcement has generated mixed reactions from fans, with many expressing sadness about the series ending while others are excited to see how Akutami will resolve the complex plotlines. The series has been praised for its innovative magic system and mature themes, setting it apart from other shonen manga.

Studio MAPPA, which produces the anime adaptation, has confirmed that they are aware of the manga's planned conclusion and are adjusting their production schedule accordingly. The anime is expected to continue adapting the manga content as it's released.

Sales of recent volumes have remained strong despite the announcement, with Volume 24 becoming the fastest-selling volume in the series' history. International publishers have also reported increased interest, suggesting the announcement has actually boosted global readership.`,
    image: 'https://images.unsplash.com/photo-1621952832288-7b2c8db1a975?w=400&h=200&fit=crop',
    category: 'manga',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    source: 'Weekly Shonen Jump',
    views: 36800,
    trending: true,
    tags: ['Jujutsu Kaisen', 'Final Arc', 'Gege Akutami', 'Conclusion'],
    author: 'Tom Nakamura',
    externalUrl: 'https://mangaplus.shueisha.co.jp/updates',
    hasExternalLink: true
  },
  {
    id: '11',
    title: 'Dragon Ball Super Manga Returns After Hiatus with New Story Arc',
    description: 'Toyotarou announces the return of Dragon Ball Super manga with an original story arc focusing on Gohan and Piccolo\'s relationship.',
    content: `The Dragon Ball Super manga is making its highly anticipated return after a extended hiatus, with artist Toyotarou and supervisor Akira Toriyama unveiling a brand new story arc. The new storyline will focus on the relationship between Gohan and Piccolo, exploring their bond as mentor and student.

The upcoming arc, tentatively titled "The Next Generation," will take place after the events of the Granolah arc and will feature Gohan taking on a more prominent role as Earth's protector while Goku and Vegeta are training off-world. Piccolo will serve as both advisor and active participant in the new adventures.

Toyotarou expressed his excitement about the return: "This new arc allows us to explore characters who haven't been in the spotlight for a while. Gohan and Piccolo have such a rich history together, and we wanted to honor that while pushing them into new territory."

The story will introduce new threats that require different approaches than the typical power-scaling battles the series is known for. Intelligence and strategy will play larger roles, making it perfect for showcasing Gohan's analytical mind and Piccolo's wisdom.

Akira Toriyama's involvement remains strong, with the Dragon Ball creator providing story outlines and character designs for the new arc. His continued supervision ensures that the new content stays true to the spirit of the Dragon Ball universe.

The first chapter of the new arc is scheduled to appear in the February issue of V-Jump magazine, with monthly releases planned going forward. International readers will be able to access the chapters through Viz Media's official platforms shortly after the Japanese release.

Early promotional artwork shows both Gohan and Piccolo in new outfits, suggesting character development and growth during the series' hiatus.`,
    image: 'https://images.unsplash.com/photo-1578894381715-de7c7c145e3e?w=400&h=200&fit=crop',
    category: 'manga',
    publishDate: new Date(Date.now() - 604800000).toISOString(),
    source: 'V-Jump Magazine',
    views: 44320,
    trending: true,
    tags: ['Dragon Ball Super', 'Toyotarou', 'Gohan', 'Piccolo', 'Return'],
    author: 'Masashi Takeshi',
    externalUrl: 'https://mangaplus.shueisha.co.jp/updates',
    hasExternalLink: true
  },
  {
    id: '12',
    title: 'Attack on Titan: The Final Chapters Special Edition Manga Announced',
    description: 'Kodansha reveals plans for a special collector\'s edition featuring the final chapters of Hajime Isayama\'s masterpiece with exclusive artwork and commentary.',
    content: `Kodansha has announced the upcoming release of "Attack on Titan: The Final Chapters Special Edition," a premium collector's manga featuring the series' concluding chapters along with exclusive content from creator Hajime Isayama. This special edition commemorates the completion of one of manga's most influential series.

The special edition will include the final nine chapters of the series (Chapters 131-139) in a large-format hardcover volume, featuring remastered artwork and enhanced page layouts that showcase Isayama's detailed illustrations. The book will also contain over 100 pages of exclusive content.

Exclusive features include Isayama's original concept sketches, alternate ending drafts that were considered during development, and detailed commentary from the author explaining his creative decisions throughout the final arc. Character design evolution charts will show how key characters developed from the series' beginning to end.

"I wanted to give readers a deeper understanding of the creative process behind Attack on Titan's conclusion," explained Isayama. "This special edition includes insights into the themes and symbolism that drove the story's final chapters."

The edition will also feature contributions from key anime staff members, including directors from Studio WIT and MAPPA, providing perspective on how the manga influenced the animated adaptation. Voice actor interviews and tributes from fellow manga creators round out the additional content.

Limited to 50,000 numbered copies worldwide, the special edition will be available in both Japanese and English simultaneously. Each copy will include a certificate of authenticity and an exclusive bookmark featuring foil artwork.

Pre-orders begin next month, with the special edition scheduled for release to coincide with the fifth anniversary of the manga's conclusion.`,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=200&fit=crop',
    category: 'manga',
    publishDate: new Date(Date.now() - 777600000).toISOString(),
    source: 'Kodansha Comics',
    views: 27890,
    trending: false,
    tags: ['Attack on Titan', 'Special Edition', 'Hajime Isayama', 'Collector'],
    author: 'Rei Tanaka',
    externalUrl: 'https://kodansha.us/news/',
    hasExternalLink: true
  },
  {
    id: '13',
    title: 'My Hero Academia Vigilantes Manga Receives Anime Adaptation Announcement',
    description: 'Studio Bones confirms that the popular spin-off series focusing on underground heroes will receive its own anime adaptation in 2025.',
    content: `Studio Bones has officially announced that My Hero Academia: Vigilantes, the popular spin-off manga series, will receive its own anime adaptation. The series, which focuses on underground heroes operating outside the official hero system, has been a fan favorite since its debut.

The spin-off, written by Hideyuki Furuhashi and illustrated by Betten Court, takes place several years before the main My Hero Academia storyline. It follows Koichi Haimawari, also known as "The Crawler," and his journey as an unlicensed hero helping people in small but meaningful ways.

Director Kenji Nagasaki, who helmed the main My Hero Academia anime series, will oversee the Vigilantes adaptation to ensure consistency with the established visual style and tone. The series will feature a darker, more street-level approach to heroism compared to the main series.

"Vigilantes offers a unique perspective on the My Hero Academia world," explained Nagasaki. "It shows how heroism can manifest in everyday situations and explores themes of social responsibility that complement the main series beautifully."

The anime will feature new voice actors for the Vigilantes-specific characters, with auditions currently underway. However, familiar characters from the main series will be voiced by their original actors when they appear in the spin-off.

Studio Bones has allocated a significant budget for the project, recognizing the series' potential to attract both existing fans and new viewers. The adaptation will consist of 24 episodes covering the complete Vigilantes storyline.

Production is scheduled to begin in early 2025, with the series expected to premiere in Fall 2025. The timing allows for the main My Hero Academia series to conclude before introducing viewers to this darker, more mature take on the superhero world.`,
    image: 'https://images.unsplash.com/photo-1578894421623-d6e04a3d7a04?w=400&h=200&fit=crop',
    category: 'manga',
    publishDate: new Date(Date.now() - 864000000).toISOString(),
    source: 'Weekly Shonen Jump',
    views: 33210,
    trending: false,
    tags: ['My Hero Academia', 'Vigilantes', 'Spin-off', 'Studio Bones'],
    author: 'Katsuki Yamamoto',
    externalUrl: 'https://www.viz.com/news',
    hasExternalLink: true
  }
];

// Enhanced top stories with real external links
const enhancedTopStories: TopStory[] = [
  {
    id: 'top1',
    title: 'Anime Industry Revenue Hits Record $31 Billion as Global Demand Soars',
    description: 'The anime industry achieved unprecedented growth in 2024, driven by streaming platforms, international licensing, and merchandise sales across all demographics.',
    content: `The global anime industry has reached a historic milestone, generating over $31 billion in revenue for 2024, representing a 23% increase from the previous year. This growth is attributed to the explosive expansion of streaming services, increased international licensing deals, and the diversification of anime content appealing to broader demographics.

Streaming platforms have been the primary driver of this growth, with services like Crunchyroll, Netflix, and Disney+ investing heavily in anime content. Original anime productions by these platforms have also contributed significantly to the industry's expansion.

The merchandise segment has seen particular strength, with anime-related products ranging from figures to fashion collaborating with luxury brands. The global reach of anime has enabled licensing deals in markets previously untapped by Japanese content creators.

According to the Japan Animation Association, international sales now represent 67% of total anime industry revenue, marking a significant shift from the domestic-focused model of previous decades. This internationalization has led to increased investment in dubbing and localization services.

The industry's growth has also created new opportunities for creators, with more studios expanding internationally and establishing partnerships with global content producers. This trend is expected to continue as anime becomes increasingly mainstream in Western entertainment markets.

Mobile gaming tie-ins and virtual reality experiences represent emerging revenue streams that could drive further growth in the coming years. The success of anime-inspired games like Genshin Impact has shown the potential for cross-media expansion.

Industry analysts predict that the $50 billion milestone could be reached by 2027 if current growth trends continue, making anime one of Japan's most valuable cultural exports.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    source: 'Japan Animation Association',
    category: 'industry',
    views: 52640,
    featured: true,
    tags: ['Industry Growth', 'Revenue', 'Streaming', 'Global Market'],
    author: 'Jennifer Kim',
    externalUrl: 'https://aja.gr.jp/english',
    hasExternalLink: true
  },
  {
    id: 'top2',
    title: 'Crunchyroll Announces Massive Expansion to 15 New Countries and Regions',
    description: 'The streaming giant plans to bring anime content to 15 new countries, making anime more accessible globally while investing in local language dubbing.',
    content: `Crunchyroll has announced its most ambitious expansion yet, planning to launch services in 15 new countries and regions throughout 2025. This expansion will bring the total number of territories served by Crunchyroll to over 200, making it the most globally accessible anime streaming platform.

The new territories include several African and South American countries where anime has been growing in popularity but has had limited official distribution channels. Crunchyroll plans to offer both subtitled and dubbed content in local languages, with initial support for Portuguese, Spanish, French, and Arabic.

"This expansion represents our commitment to making anime accessible to fans everywhere," said Rahul Purini, President of Crunchyroll. "We've seen incredible demand from these regions, and we're excited to finally serve these passionate communities officially."

The expansion will include partnerships with local telecom providers to ensure optimal streaming quality and competitive pricing structures adapted to each market's economic conditions. Crunchyroll is also planning to establish local offices in key regions to better serve these communities.

Content strategy will be tailored to regional preferences, with Crunchyroll conducting extensive market research to understand viewing patterns and popular genres in each territory. The platform will also explore opportunities for co-productions with local creators.

The announcement has been welcomed by international anime communities, many of whom have been requesting official access for years. The expansion is expected to add over 50 million potential subscribers to Crunchyroll's global user base.

Investment in local content creation is also planned, with Crunchyroll announcing partnerships with studios in several new markets to produce region-specific anime content that reflects local cultures and stories.`,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=300&fit=crop',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    source: 'Crunchyroll',
    category: 'streaming',
    views: 38230,
    featured: true,
    tags: ['Crunchyroll', 'Expansion', 'Global Access', 'Streaming'],
    author: 'Alex Thompson',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  {
    id: 'top3',
    title: 'Tokyo Anime Fair 2025 Announces Record-Breaking Attendance and Major Reveals',
    description: 'The premier anime industry event showcases upcoming projects, with over 500,000 attendees and announcements from major studios worldwide.',
    content: `Tokyo Anime Fair 2025 has concluded with record-breaking attendance figures and a series of major announcements that have sent shockwaves through the anime community. Over 500,000 visitors attended the four-day event, making it the largest anime convention in history.

Major studios used the platform to announce upcoming projects, including several surprise collaborations between Japanese and international production companies. Studio MAPPA revealed three new original series, while Studio Bones announced partnerships with Netflix for exclusive content.

The fair featured extensive panels on the future of anime technology, including demonstrations of AI-assisted animation techniques and virtual reality anime experiences. These technological advances promise to revolutionize how anime is created and consumed in the coming decade.

International presence was stronger than ever, with representatives from over 50 countries attending to discuss licensing deals and co-production opportunities. The global nature of modern anime was highlighted through panels featuring creators from diverse backgrounds working on Japanese productions.

Merchandise sales broke all previous records, with limited-edition items selling out within minutes of the fair's opening. The popularity of anime-inspired fashion and lifestyle products demonstrated the medium's influence beyond traditional entertainment boundaries.

Educational institutions also had a strong presence, with several art schools and universities showcasing student work and announcing new anime production programs designed to meet industry demand for skilled animators.

The success of Tokyo Anime Fair 2025 reflects the medium's continued growth and its evolution into a truly global entertainment phenomenon that bridges cultural and linguistic barriers.`,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    source: 'Tokyo Anime Fair',
    category: 'events',
    views: 44850,
    featured: true,
    tags: ['Tokyo Anime Fair', 'Industry Events', 'Announcements', 'Technology'],
    author: 'Hiroshi Matsuda',
    externalUrl: 'https://www.animejapan.jp/en/',
    hasExternalLink: true
  }
];

export default function News() {
  const [animeNews, setAnimeNews] = useState<NewsItem[]>([]);
  const [mangaNews, setMangaNews] = useState<NewsItem[]>([]);
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [language] = useState<'en' | 'bn'>('en');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load news data on component mount
  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    setLoading(true);
    
    try {
      // Check for cached data first
      const cachedData = getCachedNews();
      if (cachedData) {
        setAnimeNews(cachedData.anime);
        setMangaNews(cachedData.manga);
        setTopStories(cachedData.top);
        setLastUpdated(new Date(cachedData.timestamp));
        setLoading(false);
        return;
      }

      // Simulate API call with enhanced mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newsData = await fetchEnhancedNews();
      
      setAnimeNews(newsData.anime);
      setMangaNews(newsData.manga);
      setTopStories(newsData.top);
      setLastUpdated(new Date());
      
      // Cache the data
      cacheNews(newsData);
      
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Error loading news",
        description: "Failed to load the latest news. Using fallback data.",
        variant: "destructive",
      });
      
      // Use fallback data with error handling
      setAnimeNews([...enhancedAnimeNews]);
      setMangaNews([...enhancedMangaNews]);
      setTopStories([...enhancedTopStories]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnhancedNews = async (): Promise<{anime: NewsItem[], manga: NewsItem[], top: TopStory[]}> => {
    // Enhanced mock data generation with more realistic content
    const enhancedAnime = enhancedAnimeNews.map((item, index) => ({
      ...item,
      views: Math.floor(Math.random() * 50000) + 15000,
      trending: Math.random() > 0.6,
      publishDate: new Date(Date.now() - (index * 86400000 + Math.random() * 86400000)).toISOString()
    }));

    const enhancedManga = enhancedMangaNews.map((item, index) => ({
      ...item,
      views: Math.floor(Math.random() * 35000) + 12000,
      trending: Math.random() > 0.7,
      publishDate: new Date(Date.now() - (index * 86400000 + Math.random() * 86400000)).toISOString()
    }));

    const enhancedTop = enhancedTopStories.map((item, index) => ({
      ...item,
      views: Math.floor(Math.random() * 60000) + 25000,
      publishDate: new Date(Date.now() - (index * 43200000 + Math.random() * 43200000)).toISOString()
    }));

    return {
      anime: enhancedAnime,
      manga: enhancedManga,
      top: enhancedTop
    };
  };

  const getCachedNews = () => {
    try {
      const timestamp = localStorage.getItem('newsTimestamp');
      const animeCache = localStorage.getItem('animeNews');
      const mangaCache = localStorage.getItem('mangaNews');
      const topCache = localStorage.getItem('topStories');

      if (!timestamp || !animeCache || !mangaCache || !topCache) return null;

      // Check if cache is older than 30 minutes
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge > 30 * 60 * 1000) return null;

      return {
        anime: JSON.parse(animeCache),
        manga: JSON.parse(mangaCache),
        top: JSON.parse(topCache),
        timestamp
      };
    } catch (error) {
      console.error('Error reading cached news:', error);
      return null;
    }
  };

  const cacheNews = (newsData: any) => {
    try {
      localStorage.setItem('newsTimestamp', Date.now().toString());
      localStorage.setItem('animeNews', JSON.stringify(newsData.anime));
      localStorage.setItem('mangaNews', JSON.stringify(newsData.manga));
      localStorage.setItem('topStories', JSON.stringify(newsData.top));
    } catch (error) {
      console.error('Error caching news:', error);
    }
  };

  const refreshNews = async () => {
    // Clear cache and reload
    localStorage.removeItem('newsTimestamp');
    localStorage.removeItem('animeNews');
    localStorage.removeItem('mangaNews');
    localStorage.removeItem('topStories');
    
    await loadNewsData();
    
    toast({
      title: "News Updated",
      description: "Latest news has been loaded successfully.",
    });
  };

  const filterNews = (news: NewsItem[]) => {
    let filtered = news;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'anime': return language === 'bn' ? 'অ্যানিমে' : 'Anime';
      case 'manga': return language === 'bn' ? 'মাঙ্গা' : 'Manga';
      case 'games': return language === 'bn' ? 'গেমস' : 'Games';
      case 'industry': return language === 'bn' ? 'ইন্ডাস্ট্রি' : 'Industry';
      case 'streaming': return language === 'bn' ? 'স্ট্রিমিং' : 'Streaming';
      case 'events': return language === 'bn' ? 'ইভেন্ট' : 'Events';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to detail page
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleNewsClick(item.id)}>
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        {item.trending && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        )}
        <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
          {getCategoryLabel(item.category)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(item.publishDate)}
            </span>
            {item.views && (
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {item.views.toLocaleString()}
              </span>
            )}
          </div>
          <span>{item.source}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 group-hover:bg-blue-600 group-hover:text-white transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Read Article
          </Button>
          {item.hasExternalLink && item.externalUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => handleExternalLink(item.externalUrl!, e)}
              className="px-3"
              title="Visit external source"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const TopStoryCard = ({ story }: { story: TopStory }) => (
    <Card className="hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleNewsClick(story.id)}>
      <div className="relative">
        <img 
          src={story.image} 
          alt={story.title}
          className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        {story.featured && (
          <Badge className="absolute top-3 right-3 bg-gold text-black font-bold">
            ⭐ Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h2 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
          {story.title}
        </h2>
        <p className="text-gray-600 mb-4">
          {story.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(story.publishDate)}
          </span>
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {story.views.toLocaleString()} views
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {story.tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 group-hover:bg-blue-600 transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Read Full Story
          </Button>
          {story.hasExternalLink && story.externalUrl && (
            <Button 
              variant="ghost" 
              onClick={(e) => handleExternalLink(story.externalUrl!, e)}
              className="px-3"
              title="Visit external source"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language === 'bn' ? 'অ্যানিমে ও মাঙ্গা নিউজ' : 'Anime & Manga News'}
          </h1>
          <p className="text-gray-600">
            {language === 'bn' 
              ? 'সর্বশেষ অ্যানিমে, মাঙ্গা এবং গেমিং সংবাদ' 
              : 'Stay updated with the latest anime, manga, and gaming news'}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button onClick={refreshNews} className="mt-4 md:mt-0">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh News
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search news, tags, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest First</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top Stories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-red-500" />
          Top Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topStories.map((story) => (
            <TopStoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* News Tabs */}
      <Tabs defaultValue="anime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anime" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Anime & Games ({filterNews(animeNews).length})</span>
          </TabsTrigger>
          <TabsTrigger value="manga" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Manga ({filterNews(mangaNews).length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anime">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterNews(animeNews).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          {filterNews(animeNews).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No anime news found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manga">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterNews(mangaNews).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          {filterNews(mangaNews).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No manga news found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}