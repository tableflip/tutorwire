// Migrate/bootstrap the database
Meteor.startup(function () {
  // If no subjects, add subjects
  if (!Subjects.find().count()) {
    ["Maths", "English", "Science", "Biology", "Physics", "Chemistry", "Geography", "History", "Business Studies", "Economics", "Psychology", "Religious Studies", "Sociology", "Law", "Art", "Design and Technology", "Graphics", "Music", "Music Technology", "Literacy", "Numeracy", "Drama", "Philosophy", "Computer Science", "Spanish", "French", "Italian", "German", "Arabic", "Chinese", "Polish", "Portuguese", "Russian", "Turkish", "Mandarin", "Japanese", "SATs", "11+ Entrance", "Common Entrance", "Guitar", "Violin", "Bass", "Drums", "Piano", "Singing", "Keyboard", "Cello", "Viola", "Saxophone", "Clarinet", "Ukulele", "Harp", "Flute", "Dance", "Yoga", "Personal Trainer", "Tennis", "Zumba", "Karate", "Photography", "Kick Boxing", "Driving", "Pilates", "Painting", "Sculpture", "Tai Chi", "Wing Tsun", "Kung Fu", "Acting", "Life Coaching", "Programming", "Martial Arts", "Graphic Design", "Accounting", "Football", "Meditation", "Web Development"].forEach(function (s) {
      console.log("Inserting subject", s)
      Subjects.insert({name: s})
    })
  }

  if (!CityLocations.find({country: "UK"}).count()) {
    [{"name":"Bath","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.3656,51.3794]}}},{"name":"Birmingham","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.9167,52.4667]}}},{"name":"Bradford","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.90761,53.65229]}}},{"name":"Brighton","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.5515,50.525]}}},{"name":"Bristol","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.5833,51.45]}}},{"name":"Cambridge","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.125,51.96665]}}},{"name":"Canterbury","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.7132,54.41615]}}},{"name":"Carlisle","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.9333,54.8833]}}},{"name":"Chelmsford","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.4833,51.7333]}}},{"name":"Chester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.9167,53.2]}}},{"name":"Chichester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.78,50.8367]}}},{"name":"Coventry","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.55,52.4167]}}},{"name":"Derby","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.5,52.9333]}}},{"name":"Durham","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.5667,54.7667]}}},{"name":"Ely","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.4826,51.9425]}}},{"name":"Exeter","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3.5275,50.7236]}}},{"name":"Gloucester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.25,51.8333]}}},{"name":"Hereford","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.7167,52.05]}}},{"name":"Kingston upon Hull","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.3262,53.7404]}}},{"name":"Lancaster","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.8003,54.0475]}}},{"name":"Leeds","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.243214286,53.42835714]}}},{"name":"Leicester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.1333,52.6333]}}},{"name":"Lichfield","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.8167,52.6833]}}},{"name":"Lincoln","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.5333,53.2333]}}},{"name":"Liverpool","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3,53.4167]}}},{"name":"London","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.1255,51.5084]}}},{"name":"Manchester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.2374,53.4809]}}},{"name":"Newcastle upon Tyne","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.6194,54.9881]}}},{"name":"Norwich","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[1.3,52.6333]}}},{"name":"Nottingham","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.1667,52.9667]}}},{"name":"Oxford","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.256,51.7522]}}},{"name":"Peterborough","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.25,52.5833]}}},{"name":"Plymouth","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-4.14,50.37]}}},{"name":"Portsmouth","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.0714,50.8091]}}},{"name":"Preston","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.086294118,52.69015294]}}},{"name":"Ripon","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.5167,54.1167]}}},{"name":"Salford","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.14998,52.3033]}}},{"name":"Salisbury","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.7957,51.0693]}}},{"name":"Sheffield","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.4659,53.383]}}},{"name":"Southampton","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.4,50.9]}}},{"name":"St Albans","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-0.3333,51.75]}}},{"name":"Stoke-on-Trent","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.1833,53]}}},{"name":"Sunderland","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.32445,54.8023]}}},{"name":"Truro","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-5.0433,50.2617]}}},{"name":"Wakefield","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.4977,53.6833]}}},{"name":"Wells","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.6494,51.2094]}}},{"name":"Winchester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.3167,51.0167]}}},{"name":"Wolverhampton","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.1333,52.5833]}}},{"name":"Worcester","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.2,52.2]}}},{"name":"York","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1.0833,53.9667]}}},{"name":"Aberdeen","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.1,57.1333]}}},{"name":"Dundee","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.9667,56.5]}}},{"name":"Edinburgh","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3.2,55.95]}}},{"name":"Glasgow","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-4.25,55.8333]}}},{"name":"Inverness","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-4.2333,57.4667]}}},{"name":"Perth","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3.4333,56.4]}}},{"name":"Stirling","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.93735,56.7971]}}},{"name":"Bangor","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-5.1515,54.19116667]}}},{"name":"Cardiff","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.744957143,52.14425714]}}},{"name":"Newport","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-2.7963,52.56491875]}}},{"name":"St Asaph","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3.45,53.2667]}}},{"name":"Swansea","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-3.9432,51.6208]}}},{"name":"Armagh","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-6.6667,54.35]}}},{"name":"Belfast","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-5.9333,54.5833]}}},{"name":"Derry","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-5.86855,55.66155]}}},{"name":"Lisburn","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-6.0353,54.5234]}}},{"name":"Newry","country":"UK","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-6.3374,54.1784]}}}].forEach(function (c) {
      console.log("Inserting city", c.name)
      CityLocations.insert(c)
    })
  }

  Qualifications.remove({})

  if (!Qualifications.find().count()) {
    [
      {
        "name": "A-level Arabic",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "BA Arabic",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "BA Arabic Studies",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "Native Arabic",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "Fluent Arabic",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "GCSE Arabic",
        "subjects": [
          "Arabic"
        ]
      },
      {
        "name": "A-level Art",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Art and Design",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Film Studies",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Media Studies",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Graphic Design",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Graphics",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "A-level Design and Technology",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA Art",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA Fine Art",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA Art Practice",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA History of Art",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics",
          "History"
        ]
      },
      {
        "name": "BA Art and Design",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA Graphic Design",
        "subjects": [
          "Art",
          "Design and Technology",
          "Graphics"
        ]
      },
      {
        "name": "BA Photography",
        "subjects": [
          "Art",
          "Graphics"
        ]
      },
      {
        "name": "GCSE Art",
        "subjects": [
          "Art"
        ]
      },
      {
        "name": "A-level Maths",
        "subjects": [
          "Biology",
          "Business Studies",
          "Chemistry",
          "Computer Science",
          "Economics",
          "Law",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "A-level Physics",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "A-level Further Maths",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Economics",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "A-level Statistics",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Economics",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "A-level Economics",
        "subjects": [
          "Biology",
          "Business Studies",
          "Chemistry",
          "Computer Science",
          "Economics",
          "Geography",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BA Maths",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BSc Maths",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "MEng Engineering",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Design and Technology",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "BEng Engineering",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Design and Technology",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "MSc Engineering",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "BA Physics",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BSc Physics",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "Msc Computer Science",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "BSc Computer Science",
        "subjects": [
          "Biology",
          "Chemistry",
          "Computer Science",
          "Maths",
          "Numeracy",
          "Physics",
          "Science"
        ]
      },
      {
        "name": "BSc Natural Sciences",
        "subjects": [
          "Biology",
          "Chemistry",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "MSc Natural Sciences",
        "subjects": [
          "Biology",
          "Chemistry",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BSc Chemistry",
        "subjects": [
          "Biology",
          "Chemistry",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BSc Biology",
        "subjects": [
          "Biology",
          "Chemistry",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BA Psychology",
        "subjects": [
          "Biology",
          "Chemistry",
          "English",
          "Literacy",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science",
          "Sociology"
        ]
      },
      {
        "name": "BSc Psychology",
        "subjects": [
          "Biology",
          "Chemistry",
          "English",
          "Literacy",
          "Maths",
          "Numeracy",
          "Physics",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "A-level Chemistry",
        "subjects": [
          "Biology",
          "Chemistry",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "A-level Biology",
        "subjects": [
          "Biology",
          "Chemistry",
          "Psychology",
          "Science",
          "Sociology"
        ]
      },
      {
        "name": "A-level Applied Science",
        "subjects": [
          "Biology",
          "Chemistry",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "A-level Human Biology",
        "subjects": [
          "Biology",
          "Chemistry",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "BA Anthropology",
        "subjects": [
          "Biology",
          "Geography",
          "Psychology",
          "Science"
        ]
      },
      {
        "name": "GCSE Biology",
        "subjects": [
          "Biology",
          "Science"
        ]
      },
      {
        "name": "A-level Business",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "A-level Business Studies",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "A-level Law",
        "subjects": [
          "Business Studies",
          "Economics",
          "Law",
          "Religious Studies"
        ]
      },
      {
        "name": "BA Business",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BSc Business",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BA Business and Management",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BA Business Studies",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BSc Business Studies",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BSc Business and Management",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BA Management",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BSc Management",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BA Enterprise",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BSc Enterprise",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BA Economics",
        "subjects": [
          "Business Studies",
          "Economics",
          "History"
        ]
      },
      {
        "name": "GCSE Business Studies",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "BTEC Business Studies",
        "subjects": [
          "Business Studies",
          "Economics"
        ]
      },
      {
        "name": "GCSE Chemistry",
        "subjects": [
          "Chemistry",
          "Science"
        ]
      },
      {
        "name": "A-level Mandarin",
        "subjects": [
          "Chinese",
          "Mandarin"
        ]
      },
      {
        "name": "BA Chinese",
        "subjects": [
          "Chinese",
          "Mandarin"
        ]
      },
      {
        "name": "BA Chinese Studies",
        "subjects": [
          "Chinese",
          "Mandarin"
        ]
      },
      {
        "name": "BA Chinese Mandarin",
        "subjects": [
          "Chinese",
          "Mandarin"
        ]
      },
      {
        "name": "Native Chinese",
        "subjects": [
          "Chinese"
        ]
      },
      {
        "name": "Fluent Chinese",
        "subjects": [
          "Chinese"
        ]
      },
      {
        "name": "A-level Computing",
        "subjects": [
          "Computer Science"
        ]
      },
      {
        "name": "A-level Computer Science",
        "subjects": [
          "Computer Science"
        ]
      },
      {
        "name": "A-level ICT",
        "subjects": [
          "Computer Science"
        ]
      },
      {
        "name": "A-level Quantitative Methods",
        "subjects": [
          "Computer Science",
          "Maths"
        ]
      },
      {
        "name": "GCSE Design and Technology",
        "subjects": [
          "Design and Technology"
        ]
      },
      {
        "name": "A-level Drama",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "A-level Performing Arts",
        "subjects": [
          "Drama",
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "A-level Performance Studies",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Drama",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Dance",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Performing Arts",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Performance",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Theatre",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Acting",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "BA Musical Theatre",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "GCSE Drama",
        "subjects": [
          "Drama"
        ]
      },
      {
        "name": "A-level History",
        "subjects": [
          "Economics",
          "English",
          "Geography",
          "Geography",
          "History",
          "Law",
          "Literacy",
          "Philosophy",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level English Literature",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "A-level English Language",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "A-level English",
        "subjects": [
          "English",
          "History",
          "Law",
          "Literacy",
          "Philosophy",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Politics",
        "subjects": [
          "English",
          "Geography",
          "History",
          "Literacy",
          "Religious Studies"
        ]
      },
      {
        "name": "MA Linguistics",
        "subjects": [
          "English",
          "Literacy",
          "Literacy"
        ]
      },
      {
        "name": "MA English Literature",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA Linguistics",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA English Literature",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA English",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA Applied English",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA English Language",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "BA Creative Writing",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "LLB Law",
        "subjects": [
          "English",
          "Law"
        ]
      },
      {
        "name": "GCSE English",
        "subjects": [
          "English",
          "Literacy"
        ]
      },
      {
        "name": "GCSE English Literature",
        "subjects": [
          "English"
        ]
      },
      {
        "name": "GCSE English Language",
        "subjects": [
          "English"
        ]
      },
      {
        "name": "A-level French",
        "subjects": [
          "French"
        ]
      },
      {
        "name": "A-level Latin",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "BA Spanish",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "BA French",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "BA Portuguese",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "BA Italian",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "BA French and Spanish",
        "subjects": [
          "French",
          "Italian",
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "Native French",
        "subjects": [
          "French"
        ]
      },
      {
        "name": "Fluent French",
        "subjects": [
          "French"
        ]
      },
      {
        "name": "GCSE French",
        "subjects": [
          "French"
        ]
      },
      {
        "name": "A-level Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "A-level Geology",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "MA Geogpraphy",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BA Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BSc Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "MSc Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BA Coastal Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BSc Coastal Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BA Physical Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BSc Physical Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BA Geology",
        "subjects": [
          "Geography",
          "Science"
        ]
      },
      {
        "name": "BSc Geology",
        "subjects": [
          "Geography",
          "Science"
        ]
      },
      {
        "name": "BA Environment",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BSc Environment",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BA Environmental Science",
        "subjects": [
          "Geography",
          "Science"
        ]
      },
      {
        "name": "BSc Environmental Science",
        "subjects": [
          "Geography",
          "Science"
        ]
      },
      {
        "name": "BA Environmental Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "BSc Environmental Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "GCSE Geography",
        "subjects": [
          "Geography"
        ]
      },
      {
        "name": "A-level German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "BA German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "BA French and German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "Fluent German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "Native German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "GCSE German",
        "subjects": [
          "German"
        ]
      },
      {
        "name": "BA Media Studies",
        "subjects": [
          "Graphics"
        ]
      },
      {
        "name": "GCSE Graphics",
        "subjects": [
          "Graphics"
        ]
      },
      {
        "name": "A-level Classics",
        "subjects": [
          "History",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Ancient History",
        "subjects": [
          "History",
          "Philosophy",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Classical Civilisation",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "A-level Humanities",
        "subjects": [
          "History",
          "History",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Psychology",
        "subjects": [
          "History",
          "Psychology",
          "Sociology"
        ]
      },
      {
        "name": "A-level Religious Studies",
        "subjects": [
          "History",
          "Philosophy",
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Sociology",
        "subjects": [
          "History",
          "Religious Studies",
          "Sociology"
        ]
      },
      {
        "name": "BA History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "MA History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA American History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "MA American History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "MA Economics",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA Economic History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA European History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA Modern History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA Modern European History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA Archaeology",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "BA History Studies",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "GCSE History",
        "subjects": [
          "History"
        ]
      },
      {
        "name": "A-level Italian",
        "subjects": [
          "Italian"
        ]
      },
      {
        "name": "Native Italian",
        "subjects": [
          "Italian"
        ]
      },
      {
        "name": "Fluent Italian",
        "subjects": [
          "Italian"
        ]
      },
      {
        "name": "GCSE Italian",
        "subjects": [
          "Italian"
        ]
      },
      {
        "name": "A-level Japanese",
        "subjects": [
          "Japanese"
        ]
      },
      {
        "name": "BA Japanese",
        "subjects": [
          "Japanese"
        ]
      },
      {
        "name": "BA Japanese Studies",
        "subjects": [
          "Japanese"
        ]
      },
      {
        "name": "Native Japanese",
        "subjects": [
          "Japanese"
        ]
      },
      {
        "name": "Fluent Japanese",
        "subjects": [
          "Japanese"
        ]
      },
      {
        "name": "A-level Literature",
        "subjects": [
          "Law"
        ]
      },
      {
        "name": "MA English",
        "subjects": [
          "Literacy"
        ]
      },
      {
        "name": "Native Mandarin",
        "subjects": [
          "Mandarin"
        ]
      },
      {
        "name": "Fluent Mandarin",
        "subjects": [
          "Mandarin"
        ]
      },
      {
        "name": "GCSE Maths",
        "subjects": [
          "Maths",
          "Numeracy"
        ]
      },
      {
        "name": "A-level Music",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "A-level Music Technology",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BMus Music",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BA Music",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BSc Music Technology",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BSc Creative Music Technology",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BSc Digital Music",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "BSc Audio and Music Technology",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "GCSE Music",
        "subjects": [
          "Music Technology",
          "Music"
        ]
      },
      {
        "name": "A-level Philosophy",
        "subjects": [
          "Philosophy",
          "Religious Studies"
        ]
      },
      {
        "name": "BA Philosophy",
        "subjects": [
          "Philosophy",
          "Religious Studies",
          "Sociology"
        ]
      },
      {
        "name": "BA Natural Philosophy",
        "subjects": [
          "Philosophy"
        ]
      },
      {
        "name": "BA Mental Philosophy",
        "subjects": [
          "Philosophy"
        ]
      },
      {
        "name": "A-level Electronics",
        "subjects": [
          "Physics"
        ]
      },
      {
        "name": "GCSE Physics",
        "subjects": [
          "Physics",
          "Science"
        ]
      },
      {
        "name": "A-level Polish",
        "subjects": [
          "Polish"
        ]
      },
      {
        "name": "BA Polish",
        "subjects": [
          "Polish"
        ]
      },
      {
        "name": "BA Polish Studies",
        "subjects": [
          "Polish"
        ]
      },
      {
        "name": "Native Polish",
        "subjects": [
          "Polish"
        ]
      },
      {
        "name": "Fluent Polish",
        "subjects": [
          "Polish"
        ]
      },
      {
        "name": "A-level Portuguese",
        "subjects": [
          "Portuguese"
        ]
      },
      {
        "name": "A-level Spanish",
        "subjects": [
          "Portuguese",
          "Spanish"
        ]
      },
      {
        "name": "Native Portuguese",
        "subjects": [
          "Portuguese"
        ]
      },
      {
        "name": "Fluent Portuguese",
        "subjects": [
          "Portuguese"
        ]
      },
      {
        "name": "GCSE Portuguese",
        "subjects": [
          "Portuguese"
        ]
      },
      {
        "name": "BA Religious Studies",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "BA Theology",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "BA Biblical Studies",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "BA Ministry",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "BA Theology and Religion",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "GCSE Religious Studies",
        "subjects": [
          "Religious Studies"
        ]
      },
      {
        "name": "A-level Russian",
        "subjects": [
          "Russian"
        ]
      },
      {
        "name": "BA Russian",
        "subjects": [
          "Russian"
        ]
      },
      {
        "name": "BA Russian Studies",
        "subjects": [
          "Russian"
        ]
      },
      {
        "name": "Native Russian",
        "subjects": [
          "Russian"
        ]
      },
      {
        "name": "Fluent Russian",
        "subjects": [
          "Russian"
        ]
      },
      {
        "name": "GCSE Science",
        "subjects": [
          "Science"
        ]
      },
      {
        "name": "BA Sociology",
        "subjects": [
          "Sociology"
        ]
      },
      {
        "name": "BA Social Studies",
        "subjects": [
          "Sociology"
        ]
      },
      {
        "name": "Native Spanish",
        "subjects": [
          "Spanish"
        ]
      },
      {
        "name": "Fluent Spanish",
        "subjects": [
          "Spanish"
        ]
      },
      {
        "name": "GCSE Spanish",
        "subjects": [
          "Spanish"
        ]
      },
      {
        "name": "A-level Turkish",
        "subjects": [
          "Turkish"
        ]
      },
      {
        "name": "BA Turkish",
        "subjects": [
          "Turkish"
        ]
      },
      {
        "name": "BA Turkish Studies",
        "subjects": [
          "Turkish"
        ]
      },
      {
        "name": "Native Turkish",
        "subjects": [
          "Turkish"
        ]
      },
      {
        "name": "Fluent Turkish",
        "subjects": [
          "Turkish"
        ]
      }
    ].forEach(function (q) {
      console.log("Inserting qualification", q.name, "for subjects", q.subjects)
      Qualifications.insert(q)
    })
  }

  Experiences.remove({})

  if (!Experiences.find().count()) {
    [{
      name: "5 Years",
      subjects: ["*"]
    }].forEach(function (q) {
      console.log("Inserting experience", q.name, "for subjects", q.subjects)
      Experiences.insert(q)
    })
  }
})