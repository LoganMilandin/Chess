# Chess GUI (partially complete)

This is a project I made with some friends a while ago but never got a chance to finish. There's a lot of spaghetti code and not a lot of documentation (we were all beginners once) but I'm posting it anyway because of nostalgia.

## Usage

1. Clone the repository
2. Open the Chess.html file
3. Click pieces to move them

## Functionality

<img src="https://drive.google.com/uc?export=view&id=1RqUdGaFT1xYu4ck-vb92Rvt1knIrLLZt" alt="home page" width="500" height="500">

The script manages turns (so players must alternate) and highlights available moves when a piece is selected. En passant moves are not supported, but castling is.

<img src="https://drive.google.com/uc?export=view&id=1uPat3SZAAPtjZUKxIOQXFHRNxqHZbs5n" alt="home page" width="900" height="500">

As you can see, the script doesn't actually manage a game of chess according to the rules, though there is an interface for promoting pieces. The only rule implemented regarding checks is that a king cannot move itself into check.
