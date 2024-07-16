import time
import board
import adafruit_dotstar

# Define the data and clock pins for DotStar LEDs
DOTSTAR_DATA = board.D5
DOTSTAR_CLOCK = board.D6

# Initialize DotStar object
dots = adafruit_dotstar.DotStar(DOTSTAR_CLOCK, DOTSTAR_DATA, 3, brightness=0.5, pixel_order=adafruit_dotstar.RBG)

def test_leds():
    for i in range(len(dots)):
        dots[i] = (255, 0, 0)  # Red
        dots.show()
        time.sleep(1)
        dots[i] = (0, 0, 0)  # Off
        dots.show()

if __name__ == "__main__":
    test_leds()
