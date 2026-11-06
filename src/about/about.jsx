import React from 'react';
import connectFourImage from '../assets/connect-four.png';
import './about.css';

export function About() {
  const [quote, setQuote] = React.useState(null);
  const [quoteError, setQuoteError] = React.useState('');

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadQuote() {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Quote request failed');
        const data = await response.json();
        if (typeof data.quote !== 'string' || !data.quote.trim() ||
            typeof data.author !== 'string' || !data.author.trim()) {
          throw new Error('Invalid quote response');
        }
        if (!controller.signal.aborted) setQuote(data);
      } catch {
        if (!controller.signal.aborted) {
          setQuoteError('The quote could not be loaded. Please visit again to try another.');
        }
      }
    }

    loadQuote();
    return () => controller.abort();
  }, []);

  return (
    <main className="container py-4">
      <div className="row justify-content-center align-items-center g-4">
        <section className="col-12 text-center">
          <img className="about-image img-fluid rounded shadow-sm" src={connectFourImage} alt="Image of Connect 4" width="300" />
        </section>
        <section className="col-12 col-lg-8 mx-auto">
          <div className="bg-white border rounded shadow-sm p-3 p-md-4">
            <h2 className="h5 mb-3">What is Connect 4?</h2>
            <p>Connect 4 is a two-player strategy game where players take turns dropping colored pieces into a vertical board.</p>
            <p className="mb-0">The goal is to connect four of your pieces in a row horizontally, vertically, or diagonally before your opponent does.</p>
          </div>
        </section>
        <section className="col-12 col-lg-8 mx-auto" aria-labelledby="quote-heading">
          <div className="bg-white border rounded shadow-sm p-3 p-md-4">
            <h2 id="quote-heading" className="h5 mb-3">A little inspiration</h2>
            <div aria-live="polite">
              {quote ? (
                <figure className="mb-0">
                  <blockquote className="blockquote fs-6"><p>{quote.quote}</p></blockquote>
                  <figcaption className="blockquote-footer mt-2 mb-0">{quote.author}</figcaption>
                </figure>
              ) : <p className="mb-0">{quoteError || 'Loading a quote...'}</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
