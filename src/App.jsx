import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const initialEmojis = ['❤️', '🍀', '🌎', '🍎', '⚽️', '🚗', '⛵️', '💎'];
  const [cards, setCards] = useState([])
  const [firstCard, setFirstCard] = useState(null)
  const [secondCard, setSecondCard] = useState(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [lockBoard, setLockBoard] = useState(false);


  useEffect(() => {
    suffleCardsFunc()
  }, [])

  const suffleCardsFunc = () => {
    const suffleCards = [...initialEmojis, ...initialEmojis]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isRevealed: false,
        isMatched: false
      }))
    setCards(suffleCards)
    setFirstCard(null)
    setSecondCard(null)
    setWon(false)
  }


  const handleClick = (clickedCard) => {
    if (clickedCard.isMatched || clickedCard.isRevealed || secondCard || lockBoard) return;
    const updateCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isRevealed: true } : card
    )
    setCards(updateCards)
    if (!firstCard) {
      setFirstCard(clickedCard)
    }
    else {
      setSecondCard(clickedCard)
      setMoves(prev => prev + 1);
      
      if (firstCard.value === clickedCard.value) {
        setCards(prevCards => prevCards.map((card) => card.value === clickedCard.value ? { ...card, isMatched: true } : card))
        setFirstCard(null)
        setSecondCard(null)
      }
      else {
        setLockBoard(true);
        setTimeout(() => {
          setCards(prevCards => prevCards.map((card) => (card.id === firstCard.id || card.id === clickedCard.id) ? { ...card, isRevealed: false } : card))
          setFirstCard(null)
          setSecondCard(null)
          setLockBoard(false);
        }, 1000);
      }
    }
  }

  useEffect(() => {
    if (cards.length && cards.every(card => card.isMatched)) {
      setWon(true)
    }
  }, [cards])

  const resetGame = () => {
    suffleCardsFunc()
  }
  return (
    <>
      <div className="game-container">
        <h1>Match Pair Game</h1>
        <div className="grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${card.isRevealed || card.isMatched ? 'revealed' : ''}`}
              onClick={() => handleClick(card)}
            >
              {(card.isRevealed || card.isMatched) && card.value}
            </div>
          ))}
        </div>
        <p>Moves: {moves}</p>
        {won && <p className="won">🎉 You won!</p>}
        <button onClick={resetGame}>Reset</button>
      </div>
    </>
  )
}

export default App
