import { EventPlan, EventInput } from '../types/event';

export const SAMPLE_WEDDING_PLAN: EventPlan = {
  id: 'sample-wedding-royal',
  createdAt: new Date().toISOString(),
  input: {
    eventType: 'wedding',
    subType: 'Royal Heritage & Contemporary Elegance',
    title: 'Aarav & Maya’s Royal Wedding Celebration',
    date: '2026-12-18',
    time: '18:00',
    location: 'Udaipur, Rajasthan',
    guestCount: 350,
    budgetINR: 3500000,
    preferences: ['Royal Heritage', 'Live Sufi Music', 'Authentic Mewari & Continental Fusion', 'Eco-friendly Decor', 'Sunset Pheras'],
    customNotes: 'We want vibrant pastel decor for Mehendi, a starry Sufi night for Sangeet, and a grand palace sunset ceremony with fireworks.'
  },
  executiveSummary: 'A breathtaking 2-day royal heritage celebration in Udaipur combining timeless Rajasthani grandeur with modern luxury aesthetics. Designed for 350 esteemed guests within an optimized ₹35,00,000 budget.',
  budgetBreakdown: [
    {
      id: 'b-1',
      category: 'Venue & Palace Lawns (2 Days)',
      allocatedINR: 1120000,
      percentage: 32,
      priority: 'Must-Have',
      description: 'Lakeside heritage palace lawns, air-cooled banquet hall, bridal suites, and guest hospitality lounge.',
      moneySavingTip: 'Book bundle rates for weekday checkout and combine Mehendi lawn with Sangeet ballroom.',
      spentINR: 1100000,
      isBooked: true
    },
    {
      id: 'b-2',
      category: 'Catering & Artisanal Bars (4 Meals)',
      allocatedINR: 980000,
      percentage: 28,
      priority: 'Must-Have',
      description: 'Lavish Rajasthani Mewari thali, live wood-fired pizza counters, chaat street, dim sum station, and mocktail craft bar for 350 guests.',
      moneySavingTip: 'Limit live station headcount to 4 signature bars; reduce 2 heavy curries to curb food wastage.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'b-3',
      category: 'Decor, Floral Mandap & Ambient Lighting',
      allocatedINR: 525000,
      percentage: 15,
      priority: 'Must-Have',
      description: 'Sunset mandap with local marigolds and tuberose, fairy-light canopy for Sangeet, mirror-work photo backdrops.',
      moneySavingTip: 'Substitute imported orchids with local Rajnigandha, baby’s breath and brass diyas for 40% decor savings.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'b-4',
      category: 'Photography, Cinema & Drone Coverage',
      allocatedINR: 350000,
      percentage: 10,
      priority: 'Must-Have',
      description: 'Traditional & candid crew (3 photographers, 2 cinematographers), 4K drone cinematography, teaser film + coffee table book.',
      moneySavingTip: 'Negotiate all-in-one pre-wedding shoot package with wedding teaser inclusions.',
      spentINR: 100000,
      isBooked: true
    },
    {
      id: 'b-5',
      category: 'Sound, DJ & Sangeet Choreography',
      allocatedINR: 210000,
      percentage: 6,
      priority: 'Recommended',
      description: 'Celebrity wedding DJ, JBL Line-Array sound setup, intelligent moving head lights, Sangeet choreographer for 8 family dances.',
      moneySavingTip: 'Book local Udaipur audio-visual vendor to save inter-city travel & transport allowances.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'b-6',
      category: 'Bridal & Groom Styling & Makeup',
      allocatedINR: 140000,
      percentage: 4,
      priority: 'Recommended',
      description: 'HD Airbrush bridal makeup for 3 functions (Mehendi, Sangeet, Pheras) + Groom styling and mother-of-bride touchups.',
      moneySavingTip: 'Book an on-site hair/draping assistant package for bridal party group discounts.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'b-7',
      category: 'Invitations, Favors & Welcome Hampers',
      allocatedINR: 105000,
      percentage: 3,
      priority: 'Recommended',
      description: 'Interactive animated e-invites, handwritten wax-sealed physical cards for VIPs, artisanal artisanal mithai hampers.',
      moneySavingTip: 'Go 80% digital WhatsApp animated cards, saving over ₹60,000 on paper and courier courier fees.',
      spentINR: 45000,
      isBooked: true
    },
    {
      id: 'b-8',
      category: 'Emergency Contingency & Buffer',
      allocatedINR: 70000,
      percentage: 2,
      priority: 'Must-Have',
      description: 'Unforeseen expenses, last-minute extra guest plates, generator diesel backup, tip allowances.',
      moneySavingTip: 'Keep strict control over extra guest additions on wedding morning.',
      spentINR: 0,
      isBooked: false
    }
  ],
  timeline: [
    {
      id: 't-1',
      phase: '6-12 Months Before',
      title: 'Finalize Dates, Udaipur Venue & Guest List',
      description: 'Visit palace properties, sign master agreements, block hotel rooms for out-of-town guests.',
      deadlineOffset: '9 months before event',
      category: 'Venue & Logistics',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 't-2',
      phase: '6-12 Months Before',
      title: 'Book Wedding Photographer & Cinematographer',
      description: 'Lock candid photographer; confirm drone permits and pre-wedding shoot location.',
      deadlineOffset: '8 months before event',
      category: 'Media',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 't-3',
      phase: '3-6 Months Before',
      title: 'Bridal Couture & Groom Outfits Selection',
      description: 'Finalize Mehendi, Sangeet and Wedding outfits with 2 rounds of fittings.',
      deadlineOffset: '5 months before event',
      category: 'Attire',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 't-4',
      phase: '3-6 Months Before',
      title: 'Tasting Session with Caterer & Menu Finalization',
      description: 'Sample Rajasthani regional delicacies, finalize chaat lineup, desserts, and welcome drinks.',
      deadlineOffset: '4 months before event',
      category: 'Catering',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 't-5',
      phase: '1-2 Months Before',
      title: 'Dispatch Digital & Physical Invitations + RSVP Link',
      description: 'Send animated video invitations on WhatsApp and courier royal box invites to elders.',
      deadlineOffset: '6 weeks before event',
      category: 'Invitations',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 't-6',
      phase: '1-2 Months Before',
      title: 'Sangeet Song Selection & Choreography Practice',
      description: 'Start weekend rehearsals for bride & groom dance, flash mob, and parents’ performance.',
      deadlineOffset: '4 weeks before event',
      category: 'Entertainment',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: 't-7',
      phase: '2-3 Weeks Before',
      title: 'Finalize Guest Transport & Airport Pickups',
      description: 'Coordinate tempo travelers and luxury sedans for Udaipur airport and railway station.',
      deadlineOffset: '2 weeks before event',
      category: 'Logistics',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: 't-8',
      phase: 'Week of Event',
      title: 'Decor Walkthrough & Sound Check',
      description: 'Inspect lakeside mandap setup, check stage lighting, mic acoustics, and generator backup.',
      deadlineOffset: '2 days before event',
      category: 'Production',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 't-9',
      phase: 'Event Day',
      title: 'Baraat Assembly & Sunset Pheras Itinerary',
      description: 'Vintage car arrival, live dhol tasha procession, sunset varmala under petal shower, reception dinner.',
      deadlineOffset: 'Day of Event (4:00 PM)',
      category: 'Ceremony',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 't-10',
      phase: 'Post-Event',
      title: 'Vendor Settlement & Photo Preview Delivery',
      description: 'Clear remaining invoices, tip service captains, retrieve raw hard-drives from cinematography team.',
      deadlineOffset: '3 days after event',
      category: 'Wrap-up',
      isCompleted: false,
      priority: 'medium'
    }
  ],
  vendorChecklist: [
    {
      id: 'v-1',
      category: 'Catering & Hospitality Services',
      estimatedCostINR: '₹9,00,000 - ₹11,00,000',
      importance: 'Critical',
      questionsToAsk: [
        'How many live counter chefs and roaming servers are deployed per 50 guests?',
        'Do you provide copper handis and royal tableware included in per-plate price?',
        'What is your contingency plan if guest count exceeds by 15%?'
      ],
      deliverablesChecklist: [
        'Welcome drinks & mocktail flair bartenders',
        'Traditional Mewari dessert counter with live Jalebi-Rabdi',
        'Late-night midnight snack bites post Sangeet party'
      ],
      status: 'Shortlisted',
      vendorName: 'Royal Mewar Culinary Craft'
    },
    {
      id: 'v-2',
      category: 'Cinematography & Candid Photography',
      estimatedCostINR: '₹3,20,000 - ₹3,80,000',
      importance: 'Critical',
      questionsToAsk: [
        'How many weeks for teaser release and full edited wedding documentary?',
        'Is drone pilot license cleared for heritage zone flights?',
        'Do you shoot dual camera angles during the Varmala and Pheras?'
      ],
      deliverablesChecklist: [
        '3-minute cinematic Instagram reel teaser within 72 hours',
        'Full 40-minute documentary edit in 4K',
        '2 Premium leatherette bound photo albums (400 pages)'
      ],
      status: 'Booked',
      vendorName: 'Lumière Wedding Stories'
    },
    {
      id: 'v-3',
      category: 'Floral & Thematic Decor Team',
      estimatedCostINR: '₹5,00,000 - ₹6,00,000',
      importance: 'Critical',
      questionsToAsk: [
        'Will fresh flowers be misted and replaced between daytime and evening ceremonies?',
        'Are truss structures, ambient warm lighting, and generator included?',
        'What rain-proofing arrangement is prepared for the lakeside lawn?'
      ],
      deliverablesChecklist: [
        'Floral archway entrance with brass urlis and floating candles',
        '360-degree circular mandap with sunset lake view',
        'Fairy-light canopy over dining courtyard'
      ],
      status: 'To Contact'
    },
    {
      id: 'v-4',
      category: 'DJ, Sound & Light Engineers',
      estimatedCostINR: '₹1,80,000 - ₹2,30,000',
      importance: 'Important',
      questionsToAsk: [
        'Do you provide wireless cordless mics for speeches and family skits?',
        'Is local city sound permit handled by your team past 10:00 PM?',
        'Can we provide a custom Spotify playlist for cocktail hour background music?'
      ],
      deliverablesChecklist: [
        'JBL line array speaker towers',
        'Haze/fog machines for bridal couple entry',
        'Cold pyro sparkles for Varmala moment'
      ],
      status: 'Negotiating'
    },
    {
      id: 'v-5',
      category: 'Bridal Hair & Makeup Artist (MUA)',
      estimatedCostINR: '₹1,20,000 - ₹1,50,000',
      importance: 'Important',
      questionsToAsk: [
        'Do you provide on-venue touch-ups throughout the photo shoot?',
        'Is high-definition airbrush technique used for humidity resistance?',
        'Can you accommodate saree draping for close family members?'
      ],
      deliverablesChecklist: [
        'Mehendi floral hairstyle & dewy glow',
        'Glam Sangeet smokey eye & textured waves',
        'Regal traditional Pheras look with dupatta pinning'
      ],
      status: 'Shortlisted'
    }
  ],
  creativeIdeas: {
    themes: [
      {
        name: 'The Royal Mewar Twilight',
        tagline: 'Timeless Rajasthani Royalty Under Golden Candlelight',
        description: 'Deep royal indigo, warm champagne gold, and marigold amber. Accents of hand-carved jharokhas, brass urlis, and scented rose water fountains.',
        colorPalette: [
          { name: 'Royal Indigo', hex: '#1E295B' },
          { name: 'Champagne Gold', hex: '#D4AF37' },
          { name: 'Marigold Amber', hex: '#FF9933' },
          { name: 'Ivory Silk', hex: '#FDFBF7' }
        ],
        vibeTags: ['Regal', 'Heritage', 'Majestic', 'Atmospheric'],
        dressCode: 'Royal Bandhgalas, Sherwanis, and Zardozi Lehengas in Jewel Tones.'
      },
      {
        name: 'Pastel Garden Serenade',
        tagline: 'Whimsical Lakeside Floral Symphony',
        description: 'Soft lavender, blush rose, sage foliage, and pure white organza drapes. Elegant for daytime Mehendi and high-tea ceremonies.',
        colorPalette: [
          { name: 'Blush Rose', hex: '#E8A598' },
          { name: 'Soft Lavender', hex: '#B8A9C9' },
          { name: 'Sage Green', hex: '#87A96B' },
          { name: 'Pearl Cream', hex: '#FFFDD0' }
        ],
        vibeTags: ['Romantic', 'Boho-Chic', 'Airy', 'Fresh'],
        dressCode: 'Pastel Anarkalis, Floral Kurtas, and Flowing Georgette Sarees.'
      },
      {
        name: 'Starlit Sufi Soirée',
        tagline: 'Mystical Lanterns & Velvet Night Echoes',
        description: 'Moroccan fretwork lanterns, deep velvet cushions, cascading fairy-light tunnels, and Persian carpet seating for an unforgettable Sangeet.',
        colorPalette: [
          { name: 'Midnight Navy', hex: '#0F172A' },
          { name: 'Deep Emerald', hex: '#064E3B' },
          { name: 'Burnished Copper', hex: '#B45309' },
          { name: 'Warm Amber', hex: '#F59E0B' }
        ],
        vibeTags: ['Soulful', 'Vibrant', 'Glamorous', 'Musical'],
        dressCode: 'Indo-Western Tuxedos, Sequin Gowns, and Velvet Kurtas.'
      }
    ],
    decorSuggestions: [
      {
        area: 'Grand Welcome Entrance',
        idea: 'Traditional Shehnai Welcome with Rose Petal Showers & Mirror Aisle',
        elements: ['Brass urlis with floating lotus flowers & floating tea-lights', 'Custom floral monogram arch with bride & groom initials', 'Live folk instrument musicians greeting arriving guests']
      },
      {
        area: 'Sunset Mandap & Varmala Stage',
        idea: 'Pillarless Lake-Framing Floral Canopy',
        elements: ['Suspended Rajnigandha garlands with hanging crystal drops', 'Raised wooden platform directly kissing the Udaipur lake horizon', 'Concealed smoke emitters for cinematic varmala vows']
      },
      {
        area: 'Interactive Photobooth & Memory Corner',
        idea: 'Vintage Royal Carriage with Neon Hashtag',
        elements: ['Restored painted vintage tonga decorated with wild gypsophila', 'Custom neon sign: #AaravFoundHisMaya', 'Instant Polaroid photo guestbook station with metallic pens']
      }
    ],
    foodAndBeverage: {
      welcomeDrinks: [
        'Kesar Pista Shikanji with crushed saffron ice',
        'Spiced Kokum & Jamun Fizz with mint sprig',
        'Signature Coconut Lychee Cooler served in tender green coconuts'
      ],
      appetizers: [
        'Truffle Infused Galouti Kebabs on mini saffron sheermals',
        'Pesto Paneer Tikka with pomegranate reduction',
        'Crispy Lotus Stem chips tossed in Rajasthani chili salt',
        'Live Chaat Counter: Nitrogen Palak Patta Chaat & Golgappa flight with 5 flavored waters'
      ],
      mainCourseHighlights: [
        'Dal Baati Churma cooked in authentic wood embers with 4 kinds of churma',
        'Smoked Paneer Lababdar with hand-stretched garlic naan',
        'Wild Mushroom & Truffle Risotto (Continental live station)',
        'Hyderabadi Subz Dum Biryani served with burani raita and mirchi ka salan'
      ],
      dessertStations: [
        'Live Kadai Jalebi with Pistachio Rabdi',
        'Warm Baked Gulab Jamun Tartlets with saffron cream',
        'Liquid Nitrogen Ice Cream parlor featuring Sitaphal and Paan flavors'
      ],
      cateringTips: [
        'Keep one dedicated Jain/Satvik food station clearly marked with dedicated culinary servers.',
        'Arrange a midnight comfort food bar (grilled cheese sandwiches, hot kulhad chai, masala fries) during the Sangeet after-party.'
      ]
    },
    invitations: {
      digitalCardCopy: 'Two souls, one royal story. We invite you to join us on the tranquil lakesides of Udaipur as Aarav & Maya exchange eternal vows.',
      whatsappMessageTemplate: '✨ With the blessings of our parents, we warmly invite you to celebrate the wedding ceremonies of Aarav & Maya on December 18-19, 2026 at Udaipur Palace Lawns. Tap the link below to view your personalized schedule & RSVP: https://eventease.ai/aarav-maya',
      formalInvitationText: 'Mr. & Mrs. Kapoor cordially request the pleasure of your esteemed company at the wedding celebrations of their beloved children Aarav & Maya. Your presence will grace this auspicious beginning.',
      designAestheticPrompt: 'Royal Mewar floral heritage motif, gold foil embossed borders, deep navy parchment texture, elegant calligraphy typography with subtle lake reflection.',
      rsvpDeadlineRecommendation: 'Request RSVPs by October 30th (6 weeks prior) to finalize room allocations and banquet dietary counts.'
    }
  },
  smartRecommendations: [
    'Udaipur heritage venues often mandate sound reduction by 10:00 PM outdoors; shift your Sangeet DJ into the indoor banquet hall for late-night music without police disruption.',
    'Book hotel room blocks early; tourist season in December causes a 40% hike in room rates if booked within 60 days of the date.',
    'Consider a digital QR-based photo collection system so guests can instantly upload candid memories to a shared live album.'
  ]
};

export const SAMPLE_BIRTHDAY_PLAN: EventPlan = {
  id: 'sample-birthday-wonderland',
  createdAt: new Date().toISOString(),
  input: {
    eventType: 'birthday',
    subType: '1st Birthday Cosmic Astronaut Wonderland',
    title: 'Aanya’s 1st Birthday Party',
    date: '2026-11-22',
    time: '16:30',
    location: 'Bandra, Mumbai',
    guestCount: 40,
    budgetINR: 50000,
    preferences: ['Kids Fun Activities', 'Pastel Space Theme', 'Photobooth', 'Organic Toddler Menu', 'Live Magic Show'],
    customNotes: 'We want a family-friendly afternoon party with toddler-safe play zones, balloon art, and high tea for adults.'
  },
  executiveSummary: 'An enchanting cosmic celebration designed for toddlers and family friends in Mumbai within an optimized budget of ₹50,000.',
  budgetBreakdown: [
    {
      id: 'bb-1',
      category: 'Venue & Indoor Play Zone Rental',
      allocatedINR: 15000,
      percentage: 30,
      priority: 'Must-Have',
      description: 'Air-conditioned boutique banquet hall with padded soft-play toddler arena and separate lounge for grandparents.',
      moneySavingTip: 'Book afternoon slot (3:30 PM - 7:30 PM) which carries lower hall rental fees than peak dinner slots.',
      spentINR: 15000,
      isBooked: true
    },
    {
      id: 'bb-2',
      category: 'Catering & Gourmet High Tea',
      allocatedINR: 15000,
      percentage: 30,
      priority: 'Must-Have',
      description: 'Kid-friendly finger food (mini sliders, cheese pops, fruit skewers) + live pasta station & gourmet high-tea for adults.',
      moneySavingTip: 'A curated high-tea menu with heavy appetizers costs 35% less than a formal sit-down 3-course dinner.',
      spentINR: 10000,
      isBooked: true
    },
    {
      id: 'bb-3',
      category: 'Thematic Backdrop & Balloon Decor',
      allocatedINR: 7500,
      percentage: 15,
      priority: 'Must-Have',
      description: 'Pastel chrome balloon garland arch, 3D rocket ship cutout, starry ceiling fairy lights, personalized birthday stage.',
      moneySavingTip: 'Opt for biodegradable latex balloons and reusable cardboard character props.',
      spentINR: 10000,
      isBooked: true
    },
    {
      id: 'bb-4',
      category: 'Custom 2-Tier Cake & Dessert Bar',
      allocatedINR: 4000,
      percentage: 8,
      priority: 'Recommended',
      description: '2-tier organic berry and Belgian chocolate astronaut cake, astronaut cake pops, cupcake tower, personalized cookies.',
      moneySavingTip: 'Keep top tier real for cake-cutting and bottom tier dummy with sheet cake served to guests.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'bb-5',
      category: 'Kids Entertainment, Magician & Emcee',
      allocatedINR: 4000,
      percentage: 8,
      priority: 'Must-Have',
      description: 'Professional kids entertainer, interactive comedy magic show, balloon twisting artist, and tattoo/face painter.',
      moneySavingTip: 'Package emcee and magic show from the same entertainment agency.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'bb-6',
      category: 'Candid Photography & Video Reel',
      allocatedINR: 3000,
      percentage: 6,
      priority: 'Recommended',
      description: '3 hours of candid toddler & family moments coverage + 60-second celebration highlight reel.',
      moneySavingTip: 'Hire a solo specialized newborn/toddler photographer rather than an expensive commercial team.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'bb-7',
      category: 'Return Favors & Welcome Badges',
      allocatedINR: 1500,
      percentage: 3,
      priority: 'Recommended',
      description: 'Astronaut activity coloring kits, glow-in-the-dark stars, personalized astronaut badges for kids.',
      moneySavingTip: 'Order favors in bulk from wholesale craft suppliers.',
      spentINR: 0,
      isBooked: false
    }
  ],
  timeline: [
    {
      id: 'bt-1',
      phase: '1-2 Months Before',
      title: 'Book Banquet Hall & Soft-Play Provider',
      description: 'Inspect soft-play padding safety, verify air-conditioning and baby changing amenities.',
      deadlineOffset: '6 weeks before party',
      category: 'Venue',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 'bt-2',
      phase: '1-2 Months Before',
      title: 'Confirm Theme & Custom Cake Baker',
      description: 'Finalize astronaut astronaut moon design and taste sample toddler-friendly low-sugar cakes.',
      deadlineOffset: '4 weeks before party',
      category: 'Dessert',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 'bt-3',
      phase: '2-3 Weeks Before',
      title: 'Send Animated Digital WhatsApp Invitations',
      description: 'Send cute space countdown cards with RSVP link and parking advice.',
      deadlineOffset: '3 weeks before party',
      category: 'Invitations',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'bt-4',
      phase: 'Week of Event',
      title: 'Assemble Return Gift Bags & Badges',
      description: 'Pack age-appropriate coloring books, puzzles, and treats with name tags.',
      deadlineOffset: '3 days before party',
      category: 'Favors',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: 'bt-5',
      phase: 'Event Day',
      title: 'Party Schedule & Cake Cutting',
      description: '4:30 PM: Arrivals & soft play; 5:30 PM: Magic show; 6:15 PM: Cake cutting; 6:45 PM: High tea; 7:30 PM: Favors distribution.',
      deadlineOffset: 'Party day itinerary',
      category: 'Execution',
      isCompleted: false,
      priority: 'high'
    }
  ],
  vendorChecklist: [
    {
      id: 'bv-1',
      category: 'Kids Entertainment & Magician',
      estimatedCostINR: '₹22,000 - ₹30,000',
      importance: 'Critical',
      questionsToAsk: [
        'How do you keep 1-3 year olds engaged without loud sudden noises that scare toddlers?',
        'Do you provide non-toxic, hypoallergenic face paints and glitter?',
        'Does the emcee conduct fun team games for the parents too?'
      ],
      deliverablesChecklist: [
        '30-minute interactive magic & puppet show',
        'Twisted balloon animals (swords, puppies, tiaras)',
        'Kids bubble machine party finale'
      ],
      status: 'Shortlisted'
    },
    {
      id: 'bv-2',
      category: 'Custom Cake Artist',
      estimatedCostINR: '₹6,000 - ₹12,000',
      importance: 'Critical',
      questionsToAsk: [
        'Can the smash cake or bottom tier be prepared with low cane sugar or jaggery?',
        'Do you handle refrigerated delivery directly to the venue at 3:30 PM?',
        'Are fondant figurines non-edible plastic or edible sugarcraft?'
      ],
      deliverablesChecklist: [
        '2-tier 3kg thematic astronaut cake with LED moon base',
        'Matching smash cake for baby solo photos',
        '30 individually packaged cupcakes'
      ],
      status: 'Shortlisted'
    },
    {
      id: 'bv-3',
      category: 'Boutique Balloon & Backdrop Decorator',
      estimatedCostINR: '₹40,000 - ₹55,000',
      importance: 'Important',
      questionsToAsk: [
        'How many hours prior to party start will the setup be ready for photo checks?',
        'Do you use organic double-stuffed pastel balloons for matte luxury finish?',
        'Will teardown and cleanup be handled by your team post-event?'
      ],
      deliverablesChecklist: [
        '8x8 ft circular pastel galaxy backdrop with neon name light: "Aanya is ONE"',
        'Giant 3D astronaut and moon props',
        'Toddler entrance photo arch'
      ],
      status: 'To Contact'
    }
  ],
  creativeIdeas: {
    themes: [
      {
        name: 'First Trip Around the Sun',
        tagline: 'Pastel Space & Whimsical Constellations',
        description: 'Dreamy pastel lavender, dusty blue, cream yellow and iridescent silver stars celebrating baby’s milestone first year.',
        colorPalette: [
          { name: 'Cosmic Lavender', hex: '#C4B5FD' },
          { name: 'Sky Blue', hex: '#93C5FD' },
          { name: 'Solar Yellow', hex: '#FEF08A' },
          { name: 'Stardust Silver', hex: '#E2E8F0' }
        ],
        vibeTags: ['Dreamy', 'Toddler-Safe', 'Playful', 'Magical'],
        dressCode: 'Cute pastel outfits, starry prints, or casual chic.'
      },
      {
        name: 'Enchanted Forest & Woodland Friends',
        tagline: 'Little Bunnies, Fawns & Fairy Moss',
        description: 'Warm sage, blush, mushroom tan, and rustic wood accents with cute stuffed woodland creatures.',
        colorPalette: [
          { name: 'Sage Green', hex: '#86EFAC' },
          { name: 'Blush Peach', hex: '#FDBA74' },
          { name: 'Earthy Taupe', hex: '#A8A29E' },
          { name: 'Warm Cream', hex: '#FEF3C7' }
        ],
        vibeTags: ['Earthy', 'Gentle', 'Storybook', 'Charming'],
        dressCode: 'Earthy linens, floral dresses, suspenders & bowties.'
      }
    ],
    decorSuggestions: [
      {
        area: 'Main Cake-Cutting Stage',
        idea: 'Pastel Moon Cradle with Floating Balloon Clouds',
        elements: ['Illuminated Crescent Moon photo prop where baby can sit safely', 'Cascade of double-stuffed pastel blue and lavender balloons', 'Neon sign: "Two-Infinity and Beyond" or "First Trip Around the Sun"']
      },
      {
        area: 'Toddler Soft-Play Arena',
        idea: 'Padded Ball Pool with Rocket Slide',
        elements: ['Pastel grey & white ball pit', 'Foam climbing stairs and gentle mini slides', 'Safety picket fence perimeter with balloon poles']
      }
    ],
    foodAndBeverage: {
      welcomeDrinks: [
        'Strawberry Basil Sparkler',
        'Virgin Mango Colada in coconut shell',
        'Chilled Chocolate Malt Milkshakes for children'
      ],
      appetizers: [
        'Cheesy Corn Croquettes with honey mustard dip',
        'Mini Margherita Pizzas on herb focaccia bread',
        'Paneer & Bell Pepper Skewers in tangy mint marinade',
        'Live Pasta Bar: Penne in creamy pink sauce and Fusilli in basil pesto'
      ],
      mainCourseHighlights: [
        'Pav Bhaji fondue with toasted buttery cocktail pavs',
        'Vegetable Biryani with pomegranate mint raita',
        'Tacos station with refried beans, guacamole, and salsa'
      ],
      dessertStations: [
        'Warm Belgian Waffle counter with Nutella, bananas, and vanilla gelato',
        'Astronaut Cupcake tower with edible glitter',
        'Chilled Kulfi sticks with roasted almond crunch'
      ],
      cateringTips: [
        'Keep finger foods bite-sized and non-spicy for young guests.',
        'Serve hot espresso, masala chai, and cappuccino station for parents and grandparents.'
      ]
    },
    invitations: {
      digitalCardCopy: 'Blast off! Our little star Aanya is completing her First Trip Around the Sun. Join us for an afternoon of giggles, magic, and sweet treats.',
      whatsappMessageTemplate: '🚀✨ 3.. 2.. 1.. Blast Off! You are warmly invited to Aanya’s 1st Birthday Space Adventure on Nov 22 at Bandra Banquet Hall, Mumbai. Click to view schedule and RSVP: https://eventease.ai/aanya-turns-1',
      formalInvitationText: 'Rohan & Neha invite you to celebrate the joyous milestone of their daughter Aanya turning 1 year old. Your love and blessings will make her day truly celestial.',
      designAestheticPrompt: 'Cute watercolor illustration of baby astronaut sitting on a smiling crescent moon, surrounded by soft pastel planets and gold constellation lines.',
      rsvpDeadlineRecommendation: 'RSVP by Nov 10th to confirm soft-play wristbands and kids return favors.'
    }
  },
  smartRecommendations: [
    'Schedule the party right after the baby’s afternoon nap (usually 4:00 PM - 7:00 PM) so the birthday child stays cheerful and energetic.',
    'Have a designated nursing and quiet room equipped with soft lighting, wet wipes, and comfortable armchairs for nursing mothers.',
    'Prepare 10 extra favor boxes in case unannounced siblings join along.'
  ]
};

export const SAMPLE_COMMUNITY_PLAN: EventPlan = {
  id: 'sample-community-fest',
  createdAt: new Date().toISOString(),
  input: {
    eventType: 'community',
    subType: 'Neighborhood Diwali & Cultural Food Carnival',
    title: 'Greenwood Heights Grand Diwali Mela 2026',
    date: '2026-11-08',
    time: '17:00',
    location: 'Bengaluru, Karnataka',
    guestCount: 600,
    budgetINR: 800000,
    preferences: ['Eco-friendly / Zero Waste', 'Local Artisan Stalls', 'Cultural Dance Performances', 'Diya Lighting Ceremony', 'Youth Band Showcase'],
    customNotes: 'Annual society community celebration bringing together 300 resident families. Includes flea market, stage performances, street food stalls, and rangoli contest.'
  },
  executiveSummary: 'An eco-friendly, zero-waste Diwali cultural festival and street carnival in Bengaluru designed for 600+ residents within a budget of ₹8,00,000, sustained partly through vendor stall fees and community sponsorships.',
  budgetBreakdown: [
    {
      id: 'cb-1',
      category: 'Stage, Sound, LED Wall & Staging',
      allocatedINR: 240000,
      percentage: 30,
      priority: 'Must-Have',
      description: '24x16 ft covered stage, P3 outdoor LED backdrop for visuals, digital sound console, 8 wireless mics for cultural acts.',
      moneySavingTip: 'Partner with local resident tech companies for AV equipment sponsorship in exchange for banner visibility.',
      spentINR: 200000,
      isBooked: true
    },
    {
      id: 'cb-2',
      category: 'Canopy Stalls & Flea Market Setup',
      allocatedINR: 160000,
      percentage: 20,
      priority: 'Must-Have',
      description: '25 waterproof pagoda canopies with lighting, electrical points, and tables for resident food artisans and crafts.',
      moneySavingTip: 'Charge stall vendors a nominal registration fee (₹4,000 each) which offsets over ₹1,00,000 in tent rental costs.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'cb-3',
      category: 'Festive Lighting, Diyas & Rangoli Decor',
      allocatedINR: 120000,
      percentage: 15,
      priority: 'Must-Have',
      description: 'Fairy lights across 40 society trees, 5,000 clay terracotta diyas, 3 giant flower rangolis at main club entrance.',
      moneySavingTip: 'Buy terracotta diyas directly from potter artisan clusters at wholesale rates rather than commercial retail stores.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'cb-4',
      category: 'Community Buffet & Food Voucher Subsidies',
      allocatedINR: 160000,
      percentage: 20,
      priority: 'Must-Have',
      description: 'Society complimentary sweets distribution, masala chai stations, and subsidized street-food coupon vouchers.',
      moneySavingTip: 'Combine food stalls with external food truck partnerships paying a percentage revenue share to society fund.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'cb-5',
      category: 'Prizes, Trophies, Rangoli & Talent Contest',
      allocatedINR: 48000,
      percentage: 6,
      priority: 'Recommended',
      description: 'Medals, certificates, eco-friendly plant hamper hampers for children and senior citizen winners of cultural competitions.',
      moneySavingTip: 'Sponsor prizes through nearby sports clubs, supermarkets, and local dentists.',
      spentINR: 0,
      isBooked: false
    },
    {
      id: 'cb-6',
      category: 'Security, First Aid, Waste Management & Housekeeping',
      allocatedINR: 48000,
      percentage: 6,
      priority: 'Must-Have',
      description: '8 additional security guards, volunteer safety vests, segregated wet/dry compost bins, post-event cleaning crew.',
      moneySavingTip: 'Organize youth volunteer squads to assist professional crew for active crowd management.',
      spentINR: 40000,
      isBooked: true
    },
    {
      id: 'cb-7',
      category: 'Contingency & Municipal / Police Permissions',
      allocatedINR: 24000,
      percentage: 3,
      priority: 'Must-Have',
      description: 'Fire extinguisher safety inspection, noise clearance permits, backup electrical generator fuel.',
      moneySavingTip: 'File noise permits 30 days ahead to eliminate last-minute expedite penalties.',
      spentINR: 15000,
      isBooked: true
    }
  ],
  timeline: [
    {
      id: 'ct-1',
      phase: '3-6 Months Before',
      title: 'Form Organizing Committee & Budget Approval',
      description: 'Convene general resident body meeting, assign sub-committees (cultural, food stalls, logistics, safety).',
      deadlineOffset: '12 weeks before event',
      category: 'Governance',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 'ct-2',
      phase: '1-2 Months Before',
      title: 'Stall Vendor Applications & Sponsor Onboarding',
      description: 'Open booth registrations for homemade culinary treats, organic clothing, and art crafts.',
      deadlineOffset: '6 weeks before event',
      category: 'Commercial',
      isCompleted: true,
      priority: 'high'
    },
    {
      id: 'ct-3',
      phase: '1-2 Months Before',
      title: 'Auditions for Society Dance & Music Showcase',
      description: 'Schedule rehearsals for children’s classical dance, youth rock band, and senior citizens drama.',
      deadlineOffset: '4 weeks before event',
      category: 'Performances',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: 'ct-4',
      phase: '2-3 Weeks Before',
      title: 'Obtain Noise & Safety Fire Clearance',
      description: 'Submit formal notice to local Bengaluru police station and secure fire department standby clearances.',
      deadlineOffset: '2 weeks before event',
      category: 'Compliance',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'ct-5',
      phase: 'Week of Event',
      title: 'Stall Markings, Electrical Testing & Zero-Waste Bins',
      description: 'Mark 25 stall plots on central amphitheater ground; setup three-stream recycling stations with signage.',
      deadlineOffset: '2 days before event',
      category: 'Infrastructure',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'ct-6',
      phase: 'Event Day',
      title: 'Festival Day Schedule',
      description: '5:00 PM: Stalls open; 6:00 PM: Grand Diya lighting by elders; 6:30 PM: Cultural performances; 8:30 PM: Prize distribution; 9:30 PM: Community Dhol & Garba.',
      deadlineOffset: 'Event Day schedule',
      category: 'Program',
      isCompleted: false,
      priority: 'high'
    }
  ],
  vendorChecklist: [
    {
      id: 'cv-1',
      category: 'Audio-Visual & Outdoor Stage Fabricator',
      estimatedCostINR: '₹2,10,000 - ₹2,60,000',
      importance: 'Critical',
      questionsToAsk: [
        'Is the stage roof waterproof against unexpected rain showers?',
        'Do you include an outdoor P3 LED wall with media switcher for live camera feed?',
        'Is a 60 KVA silent diesel generator included with fuel backup?'
      ],
      deliverablesChecklist: [
        'Truss roof structure with spotlighting',
        'Digital stage sound system with 8 wireless vocal microphones',
        'Certified electrical distribution boxes with circuit breakers'
      ],
      status: 'Booked',
      vendorName: 'Apex Pro Sound & Stage Bengaluru'
    },
    {
      id: 'cv-2',
      category: 'Canopy & Furniture Rental Services',
      estimatedCostINR: '₹1,40,000 - ₹1,80,000',
      importance: 'Critical',
      questionsToAsk: [
        'Can all 25 stall canopies be erected 24 hours prior to allow vendor setup?',
        'Do you provide 300 banquet chairs with clean white chair covers?',
        'Are individual LED spotlights provided in each tent?'
      ],
      deliverablesChecklist: [
        '25 Waterproof German hanger / pagoda canopies (10x10 ft)',
        '300 cushioned guest chairs and 40 registration tables',
        'Rubber cable protectors across guest walkways'
      ],
      status: 'Shortlisted'
    },
    {
      id: 'cv-3',
      category: 'Zero-Waste Sanitation & Cleaning Crew',
      estimatedCostINR: '₹35,000 - ₹45,000',
      importance: 'Important',
      questionsToAsk: [
        'Do you manage on-site organic wet waste composting after the festival?',
        'Will cleaners be continuously clearing used areca leaf plates throughout the evening?',
        'Do you supply certified biodegradable garbage bags?'
      ],
      deliverablesChecklist: [
        '10 dedicated sanitation workers during peak hours',
        '12 color-coded waste segregation stations',
        'Complete morning-after grounds wash & sweep'
      ],
      status: 'To Contact'
    }
  ],
  creativeIdeas: {
    themes: [
      {
        name: 'The Sustainable Swadeshi Utsav',
        tagline: 'Eco-Friendly Traditions, Handcrafted Heritage',
        description: 'Vibrant marigold yellow, terracotta rust, neem green, and handwoven khadi fabric canopies celebrating local Indian crafts with zero single-use plastic.',
        colorPalette: [
          { name: 'Terracotta Rust', hex: '#C2410C' },
          { name: 'Marigold Yellow', hex: '#FACC15' },
          { name: 'Neem Green', hex: '#15803D' },
          { name: 'Raw Cotton Cream', hex: '#FEF9C3' }
        ],
        vibeTags: ['Eco-Conscious', 'Festive', 'Community-Centric', 'Vibrant'],
        dressCode: 'Traditional Indian Ethnic Handloom (Kurta Pajamas, Chanderi & Kanjeevaram Sarees).'
      },
      {
        name: 'Glow of Harmony & Lights',
        tagline: 'Illuminating Unity Across Generations',
        description: 'Deep royal blue night sky backdrop complemented by thousands of flickering natural oil lamps and fairy-light arches.',
        colorPalette: [
          { name: 'Midnight Blue', hex: '#1E3A8A' },
          { name: 'Golden Glow', hex: '#F59E0B' },
          { name: 'Ruby Vermillion', hex: '#B91C1C' },
          { name: 'Pure Pearl', hex: '#FFFFFF' }
        ],
        vibeTags: ['Spiritual', 'Warm', 'Grand', 'Joyous'],
        dressCode: 'Bright festive colors with gold embellishments.'
      }
    ],
    decorSuggestions: [
      {
        area: 'Society Grand Entrance Arch',
        idea: '100% Biodegradable Marigold & Sugarcane Gateway',
        elements: ['Fresh orange & yellow marigold ropes wrapped around bamboo poles', 'Traditional brass bell wind-chimes greeting residents', 'A huge 12-ft geometric flower Rangoli created by resident artists']
      },
      {
        area: 'Community Diya Lighting Walkway',
        idea: 'Luminescent Pathway of 5,000 Terracotta Lamps',
        elements: ['Raised clay pedestals outlining the central promenade', 'Eco-friendly non-polluting cotton wicks soaked in sesame oil', 'Special photo frame installation: "Happy Diwali Greenwood Family"']
      }
    ],
    foodAndBeverage: {
      welcomeDrinks: [
        'Steaming Badam Kesar Milk in traditional earthen clay Kulhads',
        'Fresh Sugarcane Juice with ginger & black salt',
        'Spiced Masala Butter Milk (Neer Moru)'
      ],
      appetizers: [
        'Assorted Hot Pakodas (Onion, Paneer, Raw Banana) with mint & sweet tamarind chutney',
        'South Indian Mysore Bonda with coconut chutney',
        'Live Dahi Vada and Papdi Chaat counter'
      ],
      mainCourseHighlights: [
        'Chole Bhature served with pickled green chilies',
        'Bisibelebath with ghee and potato chips',
        'Assorted live Dosa counter (Mysore Masala, Ghee Roast, Cheese Podi)',
        'Poori with Aloo Dum and sweet pumpkin sabzi'
      ],
      dessertStations: [
        'Freshly made Mysore Pak and hot Motichoor Laddoos',
        'Kheer / Payasam with roasted cashew nuts and raisins',
        'Live Gulab Jamun served with pistachio Rabdi'
      ],
      cateringTips: [
        'Enforce 100% natural areca nut palm leaf plates and sugarcane bagasse cups—strictly zero plastic cutlery.',
        'Set up 4 filtered drinking water dispensers with steel tumblers to eliminate packaged water bottle pollution.'
      ]
    },
    invitations: {
      digitalCardCopy: 'Greenwood Heights invites all resident families and friends to come together for an evening of light, laughter, music, and community spirit at our Grand Diwali Mela 2026.',
      whatsappMessageTemplate: '🪔✨ Happy Diwali! Greenwood Heights RWA invites you & your family to the Annual Grand Diwali Mela on Nov 8, 2026 from 5:00 PM onwards. View stalls map, cultural performance schedule & register for contests here: https://eventease.ai/greenwood-diwali',
      formalInvitationText: 'The Managing Committee of Greenwood Heights cordially invites all respected residents and guests to grace the Annual Diwali Utsav. Let us illuminate our home and hearts in joyful harmony.',
      designAestheticPrompt: 'Traditional Indian rangoli mandalas, glowing clay diyas, brass lamps, festive marigolds on rich festive silk background.',
      rsvpDeadlineRecommendation: 'Resident stall registrations close Oct 25th to finalize electrical load distribution.'
    }
  },
  smartRecommendations: [
    'Appoint an active WhatsApp coordination squad with one volunteer captain from each residential tower to share live schedule updates.',
    'Keep dedicated medical emergency first-aid kit and wheelchair access ramp ready by the clubhouse entrance.',
    'Designate a separate "Quiet Lounge" inside the clubhouse for infants and elderly residents away from the loud music.'
  ]
};

export const POPULAR_LOCATIONS = [
  'Udaipur, Rajasthan',
  'Jaipur, Rajasthan',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Delhi NCR',
  'Goa',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Kerala (Kochi / Kovalam)',
  'Ahmedabad, Gujarat',
  'Chandigarh',
  'International / Destination'
];

export const PRESET_BUDGETS = [
  { label: '₹1.5 Lakh', value: 150000, desc: 'Intimate / Milestone Party' },
  { label: '₹5 Lakh', value: 500000, desc: 'Boutique Event' },
  { label: '₹10 Lakh', value: 1000000, desc: 'Grand Celebration' },
  { label: '₹25 Lakh', value: 250000, desc: 'Deluxe Wedding / Mega Fest' },
  { label: '₹50 Lakh', value: 5000000, desc: 'Luxury Royal Wedding' },
  { label: '₹1 Crore+', value: 10000000, desc: 'Ultra Luxury Extravaganza' },
];
