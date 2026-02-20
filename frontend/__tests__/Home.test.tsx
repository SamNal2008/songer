import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByText('Songer - Hum to Search')
    expect(heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Home />)
    const description = screen.getByText('Find songs by humming them')
    expect(description).toBeInTheDocument()
  })
})
