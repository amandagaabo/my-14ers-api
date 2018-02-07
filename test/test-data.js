const testUsers = [
  {
    uuid: '416ac246-e7ac-49ff-93b4-f7e94d997e6a',
    email: 'amanda@test.com',
    password: 'Password123'
  },
  {
    uuid: '416ac246-e7ac-49ff-93b4-f7e94d997e6b',
    email: 'steve@test.com',
    password: 'Password456'
  }
];

const testPeaks = [
  {
    uuid: '416ac246-e7ac-49ff-93b4-f7e94d997e6c',
    userId: '416ac246-e7ac-49ff-93b4-f7e94d997e6a',
    peakName: 'Mt. Elbert',
    dateClimbed: '2017-07-07T06:00:00.000Z',
    notes: 'it was fun',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/mt_elbert.jpg',
    range: 'Sawatch Range',
    rank: '1',
    elevation: 14433,
    latitude: 39.11777778,
    longitude: -106.44472222
  },
  {
    uuid: '416ac246-e7ac-49ff-93b4-f7e94d997e6d',
    userId: '416ac246-e7ac-49ff-93b4-f7e94d997e6a',
    peakName: 'Blanca Peak',
    dateClimbed: '2016-10-15T06:00:00.000Z',
    notes: 'very cold',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/blanca.jpg',
    range: 'Sangre de Cristo',
    rank: '4',
    elevation: 14345,
    latitude: 37.57722222,
    longitude: -105.48527778
  },
  {
    uuid: '416ac246-e7ac-49ff-93b4-f7e94d997e6e',
    userId: '416ac246-e7ac-49ff-93b4-f7e94d997e6b',
    peakName: 'Longs Peak',
    dateClimbed: '2016-10-30T06:00:00.000Z',
    notes: 'it was long',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/longs.jpg',
    range: 'RMNP',
    rank: '4',
    elevation: 14345,
    latitude: 37.57722222,
    longitude: -105.48527778
  }
];

module.exports = { testUsers, testPeaks };
