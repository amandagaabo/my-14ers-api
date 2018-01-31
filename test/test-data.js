const testUsers = [
  {
    id: 1,
    email: 'amanda@test.com',
    password: 'Password123'
  },
  {
    id: 2,
    email: 'steve@test.com',
    password: 'Password456'
  }
];

const testPeaks = [
  {
    id: 1,
    userId: 1,
    peakName: 'Mt. Elbert',
    dateClimbed: '2017-07-07T06:00:00.000Z',
    notes: 'it was fun',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/mt_elbert.jpg',
    range: 'Sawatch Range',
    rank: 1,
    elevation: 14433,
    latitude: 39.11777778,
    longitude: -106.44472222
  },
  {
    id: 2,
    userId: 1,
    peakName: 'Blanca Peak',
    dateClimbed: '2016-10-15T06:00:00.000Z',
    notes: 'very cold',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/blanca.jpg',
    range: 'Sangre de Cristo',
    rank: 4,
    elevation: 14345,
    latitude: 37.57722222,
    longitude: -105.48527778
  },
  {
    id: 3,
    userId: 2,
    peakName: 'Longs Peak',
    dateClimbed: '10-15-2016',
    notes: 'it was long',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/longs.jpg',
    range: 'RMNP',
    rank: 4,
    elevation: 14345,
    latitude: 37.57722222,
    longitude: -105.48527778
  }
];

module.exports = { testUsers, testPeaks };
