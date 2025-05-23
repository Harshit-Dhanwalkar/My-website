# DoomPDF

This is a Doom source port that runs inside a PDF file.

Play it here: [doom.pdf]()

## Build Instructions

Clone this repository and run the following commands:

```
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
env CFLAGS=-O3 ./build.sh
```

The `build.sh` script will download Emscripten `1.39.20` automatically. You must be on Linux to build this.

The generated files will be in the `out/` directory. Then you can run `(cd out; python3 -m http.server)` to serve the files on a web server.

## Credits

This port is made by [@ading2210](https://github.com/ading2210/).
