import sys
import time
import board
import adafruit_dotstar

DOTSTAR_DATA = board.D5
DOTSTAR_CLOCK = board.D6

dots = adafruit_dotstar.DotStar(DOTSTAR_CLOCK, DOTSTAR_DATA, 3, brightness=0.2, pixel_order=adafruit_dotstar.RBG)

def set_color(color):
    for i in range(len(dots)):
        dots[i] = color
    dots.show()

def pulse_effect(color, duration=5):
    start_time = time.time()
    while time.time() - start_time < duration:
        for brightness in range(0, 255, 5):
            dots.brightness = brightness / 255.0
            set_color(color)
            time.sleep(0.02)
        for brightness in range(255, 0, -5):
            dots.brightness = brightness / 255.0
            set_color(color)
            time.sleep(0.02)
    set_color((0, 0, 0))

def strobe_effect(color, duration=1):
    start_time = time.time()
    while time.time() - start_time < duration:
        set_color(color)
        time.sleep(0.1)
        set_color((0, 0, 0))
        time.sleep(0.1)
    set_color((0, 0, 0))

if __name__ == "__main__":
    command = sys.argv[1]
    if command == "solid":
        color = tuple(map(int, sys.argv[2:]))
        set_color(color)
    elif command == "pulse":
        color = tuple(map(int, sys.argv[2:]))
        duration = float(sys.argv[3]) if len(sys.argv) > 3 else 5
        pulse_effect(color, duration)
    elif command == "strobe":
        color = tuple(map(int, sys.argv[2:]))
        duration = float(sys.argv[3]) if len(sys.argv) > 3 else 1
        strobe_effect(color, duration)
    elif command == "off":
        set_color((0, 0, 0))
