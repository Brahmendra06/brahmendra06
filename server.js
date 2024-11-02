const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/movieBooking', { useNewUrlParser: true, useUnifiedTopology: true });

const bookingSchema = new mongoose.Schema({
    movieId: String,
    theater: String,
    date: String,
    time: String,
    bookedSeats: [Number],
});

const Booking = mongoose.model('Booking', bookingSchema);

app.use(cors());
app.use(bodyParser.json());

// Get booked seats for a movie
app.get('/bookings', async (req, res) => {
    const { movieId, theater, date, time } = req.query;
    const booking = await Booking.findOne({ movieId, theater, date, time });
    res.json(booking ? booking.bookedSeats : []);
});

// Book seats
app.post('/book', async (req, res) => {
    const { movieId, theater, date, time, seats } = req.body;
    let booking = await Booking.findOne({ movieId, theater, date, time });
    
    if (booking) {
        booking.bookedSeats.push(...seats);
        await booking.save();
    } else {
        booking = new Booking({ movieId, theater, date, time, bookedSeats: seats });
        await booking.save();
    }

    res.status(200).send('Seats booked successfully!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
