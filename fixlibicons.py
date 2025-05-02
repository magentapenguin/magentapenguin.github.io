import PIL
import PIL.Image

with PIL.Image.open("public/icons/jquery.ico") as f:
    f.save("public/icons/jquery.png", "PNG")