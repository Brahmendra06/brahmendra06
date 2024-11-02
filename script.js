const movieData = {
    1: { price: 150, bookedSeats: [] },
    2: { price: 200, bookedSeats: [] },
    3: { price: 250, bookedSeats: [] }
};

let currentMovie = null;
let selectedSeats = 0;
let totalPrice = 0;

// Simulated HTML elements as objects
const elements = {
    seatCount: { innerText: '0' },
    totalPrice: { innerText: '0' },
    bookingSection: { style: { display: 'none' } },
    bookedDetails: { style: { display: 'none' }, innerText: '' },
    bookedMovie: { innerText: '' },
    bookedTheater: { innerText: '' },
    bookedDate: { innerText: '' },
    bookedTime: { innerText: '' },
    bookedSeats: { innerText: '' },
    bookedTotalPrice: { innerText: '' },
    bookingList: []
};

function updateSeatsDisplay() {
    const bookedSeats = movieData[currentMovie].bookedSeats;
    console.log(`Booked Seats for Movie ${currentMovie}:`, bookedSeats);
}

function generateSeats() {
    const seatSelection = [];
    for (let i = 1; i <= 50; i++) {
        seatSelection.push({
            number: i,
            selected: false,
            booked: movieData[currentMovie]?.bookedSeats.includes(i) || false
        });
    }
    return seatSelection;
}

function selectSeat(seatNumber) {
    const seat = elements.seatSelection.find(seat => seat.number === seatNumber);
    if (!seat.booked) {
        seat.selected = !seat.selected;
        selectedSeats = seatSelection.filter(seat => seat.selected).length;
        elements.seatCount.innerText = selectedSeats;
        totalPrice = selectedSeats * movieData[currentMovie].price;
        elements.totalPrice.innerText = totalPrice;
    }
}

document.querySelectorAll('.movie').forEach(movie => {
    movie.addEventListener('click', () => {
        currentMovie = movie.getAttribute('data-id');
        totalPrice = movieData[currentMovie].price;
        elements.totalPrice.innerText = totalPrice;
        elements.seatCount.innerText = selectedSeats;
        elements.bookingSection.style.display = 'block';
        updateSeatsDisplay();
        elements.seatSelection = generateSeats();
    });
});

function confirmBooking() {
    const bookedSeatsArray = elements.seatSelection.filter(seat => seat.selected).map(seat => seat.number);
    
    if (bookedSeatsArray.length > 0) {
        movieData[currentMovie].bookedSeats.push(...bookedSeatsArray);
        elements.bookedMovie.innerText = `Movie ${currentMovie}`;
        elements.bookedTheater.innerText = 'Theater Name';  // Replace with actual theater name
        elements.bookedDate.innerText = 'Date Selected';  // Replace with actual date
        elements.bookedTime.innerText = 'Time Selected';  // Replace with actual time
        elements.bookedSeats.innerText = bookedSeatsArray.join(', ');
        elements.bookedTotalPrice.innerText = selectedSeats * totalPrice;
        elements.bookedDetails.style.display = 'block';

        // Add to booking list
        elements.bookingList.push({
            movie: elements.bookedMovie.innerText,
            theater: elements.bookedTheater.innerText,
            date: elements.bookedDate.innerText,
            time: elements.bookedTime.innerText,
            seats: elements.bookedSeats.innerText,
            totalPrice: elements.bookedTotalPrice.innerText
        });

        console.log('Booking List:', elements.bookingList);
    }
}

// Example of selecting a seat
selectSeat(1); // Simulate selecting seat 1
selectSeat(2); // Simulate selecting seat 2
confirmBooking(); // Simulate confirming the booking
