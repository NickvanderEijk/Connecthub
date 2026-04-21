export const mockStudents = [
  { 
    id: 1, 
    name: "Lisanne M.", 
    fullName: "Lisanne Meijer",
    phone: "06-12345678",
    location: "Helpman, Groningen", 
    specialty: "Schoonmaken", 
    rating: "4.9", 
    hasVideo: true,
    description: "Zorgt voor een fris en stofvrij huis. Helpt u graag met de wekelijkse boodschappen.",
    aboutMe: "Hallo, ik ben Lisanne! Naast mijn studie verpleegkunde help ik graag mensen in de buurt. Ik vind het belangrijk dat u zich prettig voelt in uw eigen, schone huis. Ook voor een gezellig kopje thee tijdens het afstoffen maak ik graag even tijd.",
    services: ["Wekelijkse schoonmaak", "Stofzuigen en dweilen", "Boodschappen doen"],
    reviews: [
      { author: "Mevrouw de Vries", date: "Oktober 2026", rating: 5, text: "Lisanne heeft mijn woonkamer prachtig schoongemaakt, erg vriendelijk en beleefd meisje!" },
      { author: "Familie Bakker", date: "September 2026", rating: 5, text: "Komt iedere dinsdag en we zijn erg blij met haar hulp." }
    ]
  },
  { 
    id: 2, 
    name: "Sander V.", 
    fullName: "Sander Visser",
    phone: "06-87654321",
    location: "Groningen Centrum", 
    specialty: "Tuinonderhoud & Vegen", 
    rating: "4.8", 
    hasVideo: false,
    description: "Heeft groene vingers, helpt flink met onkruid wieden en de oprit netjes vegen.",
    aboutMe: "Hoi, Sander hier! Als sportieve student ben ik graag buiten aan de slag. Ik heb een passie voor planten en zorg ervoor dat uw tuin of terras er na een middagje weer superstrak bijligt.",
    services: ["Onkruid wieden", "Oprit en terras vegen", "Licht snoeiwerk"],
    reviews: [
      { author: "Meneer Jansen", date: "September 2026", rating: 4, text: "Sander werkt hard door en heeft de hele oprit onkruidvrij gemaakt." },
      { author: "Klaas", date: "Augustus 2026", rating: 5, text: "Keurig werk afgeleverd, tuin ligt er weer strak bij voor de herfst." }
    ]
  },
  { 
    id: 3, 
    name: "Tom K.", 
    fullName: "Tom Koster",
    phone: "06-11223344",
    location: "Korrewegwijk, Groningen", 
    specialty: "Kleine reparaties", 
    rating: "4.7", 
    hasVideo: true,
    description: "Zeer handig met gereedschap. Ideaal voor het ophangen van schilderijen of lampen.",
    aboutMe: "Goedendag! Mijn naam is Tom. Ik ben een technische student met veel ervaring in klussen rondom het huis. Of het nu gaat om een lastige Ikea-kast of een kapotte deurbel, ik fix het graag voor u.",
    services: ["Meubels monteren", "Lampen of kaders ophangen", "Kleine defecten repareren"],
    reviews: [
      { author: "Annie", date: "Oktober 2026", rating: 5, text: "Tom heeft supersnel mijn nieuwe lamp opgehangen. Wat een opluchting!" }
    ]
  },
  { 
    id: 4, 
    name: "Emma D.", 
    fullName: "Emma Dijk",
    phone: "06-99887766",
    location: "Haren", 
    specialty: "Schoonmaken & Opruimen", 
    rating: "5.0", 
    hasVideo: false,
    description: "Houdt van een geordend huis en brengt structuur aan waar het nodig is.",
    aboutMe: "Mijn naam is Emma en structuur is mijn tweede natuur. Ik help graag bij grote opruimklussen, zoals de kledingkast uitzoeken of de zolder netjes ordenen voor meer overzicht in huis.",
    services: ["Grondige schoonmaak", "Kasten opruimen en herorganiseren", "Ramen lappen (binnen)"],
    reviews: [
      { author: "Hanneke", date: "November 2026", rating: 5, text: "Emma is een topper. Ze heeft mijn hele kledingkast geholpen uitzoeken. Heel gezellig en efficiënt." },
      { author: "Johan V.", date: "Augustus 2026", rating: 5, text: "De ramen lappen was nog nooit zo snel gebeurd." }
    ]
  },
  { 
    id: 5, 
    name: "Daan R.", 
    fullName: "Daan de Ruiter",
    phone: "06-55443322",
    location: "Groningen Zuid", 
    specialty: "Grofvuil & Buitenklusjes", 
    rating: "4.6", 
    hasVideo: true,
    description: "Fysiek sterk, verplaatst moeiteloos zware potten of dozen in de berging.",
    aboutMe: "Hallo, ik ben Daan. Heeft u spullen die verplaatst moeten worden of wilt u wat (oude) meubels naar de stort laten brengen? Als sterke jongen neem ik u dat fysieke en zware werk met alle plezier uit handen.",
    services: ["Zware dozen/meubels verplaatsen", "Tuinmeubilair opbergen", "Grofvuil aan de weg zetten"],
    reviews: [
      { author: "Wim en Mien", date: "Oktober 2026", rating: 4, text: "Sterke knul, heeft alle zware bloempotten voor ons naar de schuur gedragen." }
    ]
  }
];

export const mockOpenRequests = [
  { id: 1, title: "Voortuin bladvrij maken", description: "De herfstbladeren moeten opgeruimd worden. Het is ongeveer 2 uur werk in een kleine voortuin. Zelf heb ik een bezem en hark liggen.", location: "Helpman, Groningen", date: "Zaterdag 14 Nov", fee: "€ 30,-", postedBy: "Meneer de Vries" },
  { id: 2, title: "Ikea PAX kast in elkaar zetten", description: "Ik heb een nieuwe PAX kast gekocht maar krijg hem alleen niet gemonteerd. Ben op zoek naar een handige student die dit vaker heeft gedaan.", location: "Groningen Centrum", date: "A.s. Vrijdag", fee: "€ 45,-", postedBy: "Mevrouw Jansen" }
];

export const mockMyDashboardRequests = [
  { 
    id: 101, 
    title: "Onkruid wieden voortuin", 
    description: "Onze voortuin heeft een flinke opfrisbeurt nodig. Hark en bezem zijn aanwezig.", 
    location: "Helpman, Groningen", 
    date: "A.s zaterdag", 
    fee: "€ 30,-",
    responses: [ mockStudents[0], mockStudents[1] ] // Lisanne M. en Sander V.
  },
  { 
    id: 102, 
    title: "Oude wasmachine naar beneden tillen", 
    description: "Mijn oude wasmachine staat op 1 hoog en moet naar de straatkant worden getild. Je hebt hier waarschijnlijk iemand bij nodig (ben zelf niet in staat om te tillen).", 
    location: "Groningen Zuid", 
    date: "Zondag", 
    fee: "€ 25,-",
    responses: [ mockStudents[4] ] // Daan R.
  }
];