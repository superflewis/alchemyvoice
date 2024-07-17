import sys
import time
import board
import adafruit_dotstar

# Define the data and clock pins for DotStar LEDs
DOTSTAR_DATA = board.D5
DOTSTAR_CLOCK = board.D6

# Initialize DotStar object
dots = adafruit_dotstar.DotStar(DOTSTAR_CLOCK, DOTSTAR_DATA, 3, brightness=0.5, pixel_order=adafruit_dotstar.RBG)

def set_color(index, color):
    print(f"Setting LED {index} to {color}")
    dots[index] = color
    dots.show()

def knight_rider_effect(color, duration=5):
    print(f"Starting Knight Rider effect with color {color} for duration {duration}")
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
    print("Knight Rider effect finished")

def pulse_green_effect(duration=5):
    print(f"Starting Pulse Green effect for duration {duration}")
    start_time = time.time()
    while time.time() - start_time < duration:
        for brightness in range(0, 256, 5):
            for i in range(len(dots)):
                dots[i] = (0, brightness, 0)
            dots.show()
            time.sleep(0.02)
        for brightness in range(255, -1, -5):
            for i in range(len(dots)):
                dots[i] = (0, brightness, 0)
            dots.show()
            time.sleep(0.02)
    # Turn off the lights at the end of the effect
    for i in range(len(dots)):
        set_color(i, (0, 0, 0))
    print("Pulse Green effect finished")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No command provided")
        sys.exit(1)

    command = sys.argv[1]
    print(f"Command: {command}")

    if command == "solid":
        color = tuple(map(int, sys.argv[2:5]))
        for i in range(len(dots)):
            set_color(i, color)
    elif command == "strobe":
        color = tuple(map(int, sys.argv[2:5]))
        duration = float(sys.argv[5]) if len(sys.argv) > 5 else 1
        strobe_effect(color, duration)
    elif command == "knight_rider":
        color = tuple(map(int, sys.argv[2:5]))
        duration = float(sys.argv[5]) if len(sys.argv) > 5 else 5
        knight_rider_effect(color, duration)
    elif command == "pulse_green":
        duration = float(sys.argv[2]) if len(sys.argv) > 2 else 5
        pulse_green_effect(duration)
    elif command == "off":
        for i in range(len(dots)):
            set_color(i, (0, 0, 0))
    else:
        print(f"Unknown command: {command}")
