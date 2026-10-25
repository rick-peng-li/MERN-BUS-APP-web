import { SEAT_LETTERS } from '@/utils/constants';
import './SeatMap.css';

export default function SeatMap({ totalSeats = 36, bookedSeats = [], selectedSeats = [], onToggle }) {
  const rowCount = Math.ceil(totalSeats / SEAT_LETTERS.length);

  return (
    <div className="seat-map">
      <div className="seat-map__legend">
        <span className="legend-item">
          <i className="legend-swatch legend-swatch--available" /> Available
        </span>
        <span className="legend-item">
          <i className="legend-swatch legend-swatch--selected" /> Selected
        </span>
        <span className="legend-item">
          <i className="legend-swatch legend-swatch--booked" /> Booked
        </span>
      </div>

      <div className="seat-map__driver">
        <span className="seat-map__wheel" />
        <span>Front of coach</span>
      </div>

      <div className="seat-map__deck">
        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <div className="seat-map__row" key={rowIndex}>
            {SEAT_LETTERS.map(letter => {
              const seat = `${rowIndex + 1}${letter}`;
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  type="button"
                  key={seat}
                  className={[
                    'seat',
                    isBooked ? 'seat--booked' : '',
                    isSelected ? 'seat--selected' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={isBooked}
                  aria-pressed={isSelected}
                  aria-label={`Seat ${seat}${isBooked ? ' (already booked)' : ''}`}
                  onClick={() => onToggle(seat)}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
