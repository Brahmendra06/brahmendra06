const movieData = {
    1: { price: 150, bookedSeats: [] },
    2: { price: 200, bookedSeats: [] },
    3: { price: 250, bookedSeats: [] }
};

let currentMovie = null;
let selectedSeats = 0;
let totalPrice = 0;

const seatCountElement = document.getElementById('seatCount');
const totalPriceElement = document.getElementById('totalPrice');
const bookingSection = document.getElementById('bookingSection');
const bookedDetails = document.getElementById('bookedDetails');
const bookedMovie = document.getElementById('bookedMovie');
const bookedTheater = document.getElementById('bookedTheater');
const bookedDate = document.getElementById('bookedDate');
const bookedTime = document.getElementById('bookedTime');
const bookedSeats = document.getElementById('bookedSeats');
const bookedTotalPrice = document.getElementById('bookedTotalPrice');
const bookingList = document.getElementById('bookingList');

document.querySelectorAll('.movie').forEach(movie => {
    movie.addEventListener('click', () => {
        currentMovie = movie.getAttribute('data-id');
        totalPrice = movieData[currentMovie].price;
        totalPriceElement.innerText = totalPrice;
        seatCountElement.innerText = selectedSeats;
        bookingSection.style.display = 'block';
        updateSeatsDisplay();
    });
});

document.getElementById('theaterName').addEventListener('change', updateSeatsDisplay);
document.getElementById('dateSelection').addEventListener('change', updateSeatsDisplay);
document.getElementById('timeSelection').addEventListener('change', updateSeatsDisplay);

function generateSeats() {
    const seatSelection = document.getElementById('seatSelection');
    for (let i = 1; i <= 50; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.innerText = i;
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('booked')) {
                seat.classList.toggle('selected');
                selectedSeats = document.querySelectorAll('.seat.selected').length;
                seatCountElement.innerText = selectedSeats;
                totalPriceElement.innerText = selectedSeats * totalPrice;
            }
        });
        seatSelection.appendChild(seat);
    }
}

function updateSeatsDisplay() {
    const selectedTheater = document.getElementById('theaterName').value;
    const selectedDate = document.getElementById('dateSelection').value;
    const selectedTime = document.getElementById('timeSelection').value;
    const seatSelection = document.getElementById('seatSelection');

    Array.from(seatSelection.children).forEach(seat => {
        seat.classList.remove('selected', 'booked');
    });

    if (currentMovie && selectedTheater && selectedDate && selectedTime) {
        const bookedSeats = movieData[currentMovie].bookedSeats;
        bookedSeats.forEach(seatNumber => {
            const seatElement = seatSelection.querySelector(`div:nth-child(${seatNumber})`);
            if (seatElement) {
                seatElement.classList.add('booked');
            }
        });
    }
}

document.getElementById('confirmButton').addEventListener('click', () => {
    const bookedSeatsArray = Array.from(document.querySelectorAll('.seat.selected')).map(seat => seat.innerText);
    
    if (bookedSeatsArray.length > 0) {
        movieData[currentMovie].bookedSeats.push(...bookedSeatsArray);
        bookedMovie.innerText = document.querySelector(`.movie[data-id="${currentMovie}"] p`).innerText;
        bookedTheater.innerText = document.getElementById('theaterName').value;
        bookedDate.innerText = document.getElementById('dateSelection').value;
        bookedTime.innerText = document.getElementById('timeSelection').value;
        bookedSeats.innerText = bookedSeatsArray.join(', ');
        bookedTotalPrice.innerText = selectedSeats * totalPrice;
        bookedDetails.style.display = 'block';

        // Add to booking list
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <p>Movie: ${bookedMovie.innerText}</p>
            <p>Theater: ${bookedTheater.innerText}</p>
            <p>Date: ${bookedDate.innerText}</p>
            <p>Time: ${bookedTime.innerText}</p>
            <p>Seats: ${bookedSeats.innerText}</p>
            <p>Total Price: ₹${bookedTotalPrice.innerText}</p>
        `;
        bookingList.appendChild(bookingItem);
    }
});

generateSeats();
