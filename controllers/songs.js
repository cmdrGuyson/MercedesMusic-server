const song = require("../models/song");
const { multerUpload } = require("../middleware/multer");
const firebaseConfig = require("../config/fb_config");
const { admin } = require("../admin");
const fs = require("fs");

const Song = require("../models/song");
const Playlist = require("../models/playlist");
const { response } = require("express");
const { request } = require("http");

exports.upload_song = (request, response) => {
  multerUpload(request, response, async (error) => {
    if (error) {
      //instanceof multer.MulterError

      if (error.code == "LIMIT_FILE_SIZE") {
        error.message = "File Size is too large.";
      }
      return response.status(500).json({ error });
    } else {
      if (!request.file) {
        return response
          .status(500)
          .json({ error: { message: "File not found" } });
      }

      try {
        let song = {
          name: request.body.name,
        };

        if (!song.name)
          return response.status(400).json({ error: "Song name is required" });

        await admin
          .storage()
          .bucket()
          .upload(`public/tmp/${request.file.filename}`, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: request.file.mimetype,
              },
            },
          });

        song.url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${request.file.filename}?alt=media`;

        const result = await Song.create(song);

        //Delete file from temp storage
        fs.unlinkSync(`public/tmp/${request.file.filename}`);

        return response.status(201).json({ song: result });
      } catch (error) {
        console.log(error);
        return response.status(500).json({ error });
      }
    }
  });
};

exports.get_all_songs = async (request, response) => {
  try {
    const songs = await Song.find();
    return response.status(200).json({ songs });
  } catch (error) {
    return response.status(500).json({ error });
  }
};

exports.get_all_playlists = async (request, response) => {
  try {
    const playlists = await Playlist.find();
    return response.status(200).json({ playlists });
  } catch (error) {
    return response.status(500).json({ error });
  }
};

exports.create_playlist = async (request, response) => {
  try {
    const name = request.body.name;

    if (!name) return response.status(400).json({ error: "Name is required" });

    const remaining = await Playlist.find({ name });

    if (remaining.length > 0)
      return response
        .status(400)
        .json({ error: "Playlist with same name exists" });

    const playlist = await Playlist.create({ name });

    return response.status(201).json({ playlist });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

exports.add_to_playlist = async (request, response) => {
  const playlist_id = request.params.id;
  const song_ids = request.body.songs;

  if (!song_ids || song_ids.length < 1)
    return response.status(400).json({ error: "Songs are needed" });

  try {
    const playlist = await Playlist.findById(playlist_id)
      .populate("songs")
      .orFail();

    const songs = await Song.find({ _id: { $in: song_ids } });

    songs.forEach((song) => {
      playlist.songs.push(song);
    });

    playlist.save();

    return response.status(200).json({ playlist });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

exports.get_playlist = async (request, response) => {
  const id = request.params.id;
  try {
    const playlist = await Playlist.findById(id).populate("songs").orFail();
    return response.status(200).json({ playlist });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};
