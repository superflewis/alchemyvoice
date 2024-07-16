import sys
import time
import board
import adafruit_dotstar

# Define the data and clock pins for DotStar LEDs
DOTSTAR_DATA = board.D5
DOTSTAR_CLOCK = board.D6

# Initialize DotStar object
dots = adafruit_dotstar.DotStar(DOTSTAR_CLOCK, DOTSTAR_DATA, 3, brightness=0.2, pixel_order=adafruit_dotstar.RBG)

def set_color(index, color):
    dots[index] = color
    dots.show()

def knight_rider_effect(color, duration=5):
    start_time = time.time()
    while time.time() - start_time < duration:
        for i in range(len(dots)):
            set_color(i, color)
            time.sleep(0.1)
            set_color(i, (0, 0, 0))
        for i in range(len(dots)-2, 0, -1):
            set_color(i, color)
            time.sleep(0.1)
            set_color(i, (0, 0, 0))
    # Turn off the lights at the end of the effect
    for i in range(len(dots)):
        set_color(i, (0, 0, 0))

if __name__ == "__main__":
    command = sys.argv[1]
    if command == "solid":
        color = tuple(map(int, sys.argv[2:]))
        for i in range(len(dots)):
            set_color(i, color)
    elif command == "strobe":
        color = tuple(map(int, sys.argv[2:]))
        duration = float(sys.argv[3]) if len(sys.argv) > 3 else 1
        strobe_effect(color, duration)
    elif command == "knight_rider":
        color = tuple(map(int, sys.argv[2:]))
        duration = float(sys.argv[3]) if len(sys.argv) > 3 else 5
        knight_rider_effect(color, duration)
    elif command == "off":
        for i in range(len(dots)):
            set_color(i, (0, 0, 0))
