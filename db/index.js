const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize.DataTypes;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd');

const Artist = conn.define('artist', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING
});

const Album = conn.define('album', {
  name: STRING, 
})

const Song = conn.define('song', {
  name: STRING, 
  duration: INTEGER
})
const Track = conn.define('track', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  idx: INTEGER
})

Album.belongsTo(Artist)
Track.belongsTo(Album)

Song.belongsTo(Artist)
Track.belongsTo(Song)

Artist.hasMany(Album)
Artist.hasMany(Song)

Album.hasMany(Track)
Song.hasMany(Track)

// const data = {
//   artists: ['The Weeknd', 'Metallica', 'Adele'],
//   albums: ['starboy', 'reload', 'twentyOne'],
//   songs: ['I feel it coming', 'fuel', 'lovesong']
// }


const syncAndSeed = async()=> {
  await conn.sync({ force: true });
//   const [artists, albums, songs] = await Promise.all([
//     Promise.all(data.artists.map( artist =>  Artist.create({name: artist}))),
//     Promise.all(data.albums.map( album =>  Album.create({name: album}))),
//     Promise.all(data.songs.map( song =>  Song.create({name: song})))
//  ])
  const [weeknd, metalica, adele] = await Promise.all([
    Artist.create({ name: 'The Weeknd'}),
    Artist.create({ name: 'Metalica'}),
    Artist.create({ name: 'Adele'})
  ]);
  const [starboy, reload, twentyOne] = await Promise.all([
    Album.create({ name: 'starboy'}),
    Album.create({ name: 'reload'}),
    Album.create({ name: 'twentyOne'})
  ]);
  const [feelItComing, fuel, lovesong ] = await Promise.all([
    Song.create({ name: 'I feel it coming'}),
    Song.create({ name: 'fuel'}),
    Song.create({ name: 'lovesong'})
  ]);
  

  
  starboy.artistId = weeknd.id;
  await starboy.save()

  reload.artistId = metalica.id;
  await reload.save()

  twentyOne.artistId = adele.id
  await twentyOne.save()

  // feelItComing.artistId = weeknd.id
  // await feelItComing.save()

  // fuel.artistId = metalica.id
  // await fuel.save()

  // lovesong.artistId = adele.id
  // await lovesong.save()

 
  
  return {
    artists: {
      weeknd,
      metalica,
      adele
    }
  };

};


module.exports = {
  syncAndSeed,
  models: {
    Artist, 
    Song, 
    Album,
    Track
  }
};


