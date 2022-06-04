import React, { useState } from "react";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

interface channel {
  title?: string;
  description?: string;
}

interface feedItem {
  link?: string;
  title?: string;
  description?: string;
  pubDate?: string;
}

async function fetchRSSFeed(url: string): Promise<any> {
  // Use the heroku api to bypass CORS blocking in the feeds service
  // Temporary permission will have to be got at https://cors-anywhere.herokuapp.com/
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const text = await res.text();
  const { rss } = parser.parse(text);
  return rss;
}

function RSSClient(): JSX.Element {
  const [rssUrl, setRssUrl] = useState(
    "https://feeds.acast.com/public/shows/5ea17537-f11f-4532-8202-294d976b9d5c"
  );
  const [channel, setChannel] = useState<channel>({});
  const [items, setItems] = useState<feedItem[]>([]);

  async function getRss(event): Promise<void> {
    event.preventDefault();
    const rss = await fetchRSSFeed(rssUrl);
    setChannel({
      title: rss.channel.title,
      description: rss.channel.description,
    });
    const feedItems: feedItem[] = [];
    rss.channel.item.forEach((item) => {
      feedItems.push({
        title: item.title,
        description: item.description,
      });
    });
    setItems(feedItems);
  }

  return (
    <>
      <div className="col-6">
        <h5>RSS Client</h5>
        <form onSubmit={getRss}>
          <div className="mb-3">
            <label htmlFor="rssUrlInput" className="form-label">
              Email address
            </label>
            <input
              type="text"
              className="form-control"
              id="rssUrlInput"
              aria-describedby="rssHelp"
              onChange={(e) => setRssUrl(e.target.value)}
              value={rssUrl}
            />
            <div id="rssHelp" className="form-text">
              URL of the RSS feed
            </div>
          </div>
          <button type="submit" className="btn btn-sm btn-primary">
            Submit
          </button>
        </form>
      </div>
      <hr />
      {channel.title && (
        <div className="row">
          <div className="col">
            <h4>Channel: {channel.title}</h4>
            <div
              dangerouslySetInnerHTML={{ __html: channel.description || "" }}
            />
          </div>
        </div>
      )}

      {items.map((item, i) => {
        return (
          <div className="col" key={`item-${i}`}>
            <h5>{item.title}</h5>
            <div dangerouslySetInnerHTML={{ __html: item.description || "" }} />
            <a href={item.link}>{item.link}</a>
          </div>
        );
      })}
    </>
  );
}

export default RSSClient;
