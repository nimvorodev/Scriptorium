export interface Spell {
  id: string;
  icon: string;
  name: string;
  category: string;
  desc: string;
  prompt: string;
}

export const SPELLS: Spell[] = [
  {
    id: "todo", icon: "ListTodo", name: "The To-Do Grimoire", category: "Daily Rituals",
    desc: "A task list that remembers, with a progress bar and gentle motion.",
    prompt: "A cosy to-do list with warm colours, gentle animations, a progress bar, filters for all/active/done, and it should remember my tasks between visits.",
  },
  {
    id: "pomodoro", icon: "Hourglass", name: "The Focus Hourglass", category: "Daily Rituals",
    desc: "A pomodoro timer with a circular dial and rest cycles.",
    prompt: "A pomodoro focus timer — 25 minute sessions with short and long rests, a beautiful circular progress dial, and a session counter.",
  },
  {
    id: "ledger", icon: "Coins", name: "The Merchant's Ledger", category: "Daily Rituals",
    desc: "Track income and spending with a balance and simple chart.",
    prompt: "A personal expense ledger where I record income and spending, see my balance, a comparison bar, and can delete entries. Remember my data.",
  },
  {
    id: "calculator", icon: "Calculator", name: "The Reckoning Stone", category: "Tools of Reckoning",
    desc: "A calculator with keyboard support and satisfying presses.",
    prompt: "A sleek calculator with a two-line display, keyboard support, percent and backspace, and satisfying button press animations.",
  },
  {
    id: "palette", icon: "Palette", name: "The Alchemist's Palette", category: "Tools of Reckoning",
    desc: "Five harmonious hues, lockable swatches, copyable hex codes.",
    prompt: "A colour palette generator with five harmonious hues, lockable swatches, click-to-copy hex codes, a spacebar shortcut, and a copy-as-CSS button.",
  },
  {
    id: "draw", icon: "Brush", name: "The Illuminator's Canvas", category: "Tools of Reckoning",
    desc: "A drawing pad with coloured inks, nib sizes and PNG export.",
    prompt: "A drawing canvas with coloured inks, a custom colour picker, brush size slider, an eraser, clear button, and save-as-PNG.",
  },
  {
    id: "game", icon: "Gamepad2", name: "Three Crosses", category: "Games & Delights",
    desc: "Tic-tac-toe against a small but cunning opponent.",
    prompt: "A tic-tac-toe game where I play against a clever little AI that tries to win and block, with a scoreboard and winning-line highlight.",
  },
  {
    id: "quotes", icon: "Quote", name: "The Oracle of Quotes", category: "Games & Delights",
    desc: "Wisdom of the ages with elegant type and a copy button.",
    prompt: "An inspirational quote machine with elegant serif typography, a giant decorative quotation mark, smooth fade transitions, and a copy button.",
  },
  {
    id: "quiz", icon: "Rocket", name: "The Astronomer's Trial", category: "Games & Delights",
    desc: "A five-question space quiz with score and results screen.",
    prompt: "A fun quiz game about space with 5 multiple-choice questions, instant right/wrong feedback, score tracking, and a celebratory results screen with a replay button.",
  },
  {
    id: "landing", icon: "Store", name: "Ember & Wick", category: "Pages & Portfolios",
    desc: "A landing page for a cosy candle shop, hero to footer.",
    prompt: "A landing page for a cosy candle shop called Ember & Wick — warm palette, a hero with a call to action, three product features, a testimonial, and a newsletter signup form.",
  },
  {
    id: "portfolio", icon: "Camera", name: "The Chronicler's Portfolio", category: "Pages & Portfolios",
    desc: "A one-page photographer portfolio with gallery and about.",
    prompt: "A one-page portfolio for a photographer named June — moody palette, a gallery grid made of CSS gradient art, an about section, and a contact form.",
  },
  {
    id: "bakery", icon: "Croissant", name: "The Golden Crumb", category: "Pages & Portfolios",
    desc: "A bakery page with menu, hours, and a friendly order form.",
    prompt: "A website for a village bakery called The Golden Crumb — a mouth-watering menu with prices, opening hours, and a simple pre-order form.",
  },
];

export const STARTER_CHIPS = [
  { label: "✦ A cosy to-do list", prompt: SPELLS[0].prompt },
  { label: "⏳ A focus timer", prompt: SPELLS[1].prompt },
  { label: "🎨 A colour palette maker", prompt: SPELLS[4].prompt },
];

export const REFINE_CHIPS = [
  { label: "🌙 Make it dark", prompt: "Make it dark — a night-time version with the same features." },
  { label: "✨ More motion", prompt: "Give it more motion — gentle entrance animations and lively hover effects." },
  { label: "💚 Emerald ink", prompt: "Recolour it with an emerald green accent." },
  { label: "🌹 Rose ink", prompt: "Recolour it with a rose pink accent." },
];