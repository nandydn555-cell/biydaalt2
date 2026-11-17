import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Landscape, Pixels } from './pixel-art.jsx'
import { portfolio } from './portfolio.js'
import './styles.css'

function Tags({ items }) {
  return <ul className="tags">{items.map((item) => <li key={item}>{item}</li>)}</ul>
}

function Header() {
  return <header className="site-header">
    <div className="shell header-inner">
      <a className="brand" href="#home"><Pixels name="heart" /> <span>PIXEL WORLD</span></a>
      <nav aria-label="Үндсэн цэс" className="nav-links">
        <a href="#about">About</a><a href="#projects">Projects</a><a href="#badges">Badges</a><a href="#contact">Contact</a>
      </nav>
      <span className="course">{portfolio.course} / БИЕ ДААЛТ 2</span>
    </div>
  </header>
}

function Hero() {
  const [titleStart, ...titleWords] = portfolio.siteName.split(' ')
  return <section className="hero" aria-labelledby="hero-title">
    <div className="sky-decoration" aria-hidden="true">
      <div className="sun" />
      {['one', 'two', 'three', 'four'].map((position) => (
        <div className={'cloud cloud-' + position} key={position}><Pixels name="cloud" /></div>
      ))}
      <span className="sky-spark spark-one">✦</span>
      <span className="sky-spark spark-two">✦</span>
      <span className="sky-spark spark-three">✧</span>
    </div>
    <Landscape />
    <div className="hero-copy">
      <div className="hearts" aria-hidden="true">
        {[0, 1, 2].map((heart) => <Pixels name="heart" key={heart} />)}
      </div>
      <h1 id="hero-title"><span>{titleStart}</span> <span>{titleWords.join(' ')}</span></h1>
      <p className="hero-role">{portfolio.name} <b>·</b> {portfolio.role}</p>
      <a className="pixel-button start" href="#about"><span aria-hidden="true">▶</span> Press Start</a>
    </div>
  </section>
}

function CharacterSelect() {
  const [index, setIndex] = useState(0)
  const card = portfolio.profile[index]
  function move(direction) {
    setIndex((current) => (current + direction + portfolio.profile.length) % portfolio.profile.length)
  }
  function handleKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return <section id="about" className="profile" aria-labelledby="profile-heading">
    <div className="shell section-shell">
      <header className="section-heading">
        <p className="eyebrow"><span aria-hidden="true">✦</span> ABOUT &amp; SKILLS</p>
        <h2 id="profile-heading">Character Select</h2>
      </header>
      <div className="cabinet" role="group" aria-label="Профайлын карт сонгох" tabIndex={0} onKeyDown={handleKey}>
        <div className="cabinet-marquee">
          <span aria-hidden="true">✦</span> PLAYER PROFILE <span aria-hidden="true">✦</span>
        </div>
        <div className="cabinet-body">
          <div className="screen">
            <div className="screen-stage">
              <button className="pixel-button arrow" type="button" aria-label="Previous profile card" onClick={() => move(-1)}>◀</button>
              <div className="portrait" role="img" aria-label="Нандингийн пиксел дүр"><Pixels name="avatar" /></div>
              <button className="pixel-button arrow" type="button" aria-label="Next profile card" onClick={() => move(1)}>▶</button>
            </div>
            <div className="screen-caption"><span>{portfolio.name}</span><span>{index + 1} / {portfolio.profile.length}</span></div>
          </div>
          <div className="character-card" aria-live="polite" aria-atomic="true">
            <div className="slide-content" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.skills && <Tags items={card.skills} />}
              <p className="application">{card.application}</p>
            </div>
          </div>
        </div>
        <div className="cabinet-controls" aria-hidden="true"><i /><i /><i /><span /><i /><i /></div>
      </div>
    </div>
  </section>
}

function PreviewGallery({ previews, title }) {
  const [selected, setSelected] = useState(0)
  const preview = previews[selected]
  return <figure className="preview-gallery">
    {previews.length > 1 && <div className="preview-controls" role="group" aria-label={title + ' · Дэлгэц сонгох'}>
      {previews.map(({ label }, index) => (
        <button key={label} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>{label}</button>
      ))}
    </div>}
    <a className={'preview-image-link' + (preview.portrait ? ' portrait-preview' : '')} href={preview.src} target="_blank" rel="noopener" aria-label={preview.alt + ' · Томоор нээх'}>
      <img className="project-image" src={preview.src} alt={preview.alt} decoding="async" />
    </a>
    <figcaption><span>{preview.label}</span><a href={preview.src} target="_blank" rel="noopener">Томоор нээх ↗</a></figcaption>
  </figure>
}

function ProjectPreview({ project }) {
  if (project.previews?.length) return <PreviewGallery previews={project.previews} title={project.title} />
  if (project.image) return <PreviewGallery previews={[{ ...project.image, label: 'Дэлгэцийн зураг' }]} title={project.title} />
  if (project.id === 'network') {
    return <figure className="network-preview">
      <div className="network-flow" role="img" aria-label="LAN A болон LAN B-г холбосон router">
        <span>LAN A</span><i aria-hidden="true" /><strong>Router</strong><i aria-hidden="true" /><span>LAN B</span>
      </div>
      <figcaption><strong>Сүлжээний топологи</strong><br />DHCP → клиентын IP<br />DNS · ufe.edu.mn → серверийн IP<br />HTTP → веб сервер</figcaption>
    </figure>
  }
  return <div className={'project-preview ' + project.id} aria-hidden="true"><Pixels name={project.id} /></div>
}

function QuestLog() {
  const [expanded, setExpanded] = useState(null)
  const [viewed, setViewed] = useState(new Set())
  function toggle(id) {
    if (expanded === id) {
      setExpanded(null)
    } else {
      setExpanded(id)
      setViewed((current) => new Set(current).add(id))
    }
  }
  return <section id="projects" className="quests" aria-labelledby="quests-heading">
    <div className="shell section-shell">
      <header className="section-heading">
        <p className="eyebrow"><span aria-hidden="true">✦</span> PROJECTS</p>
        <h2 id="quests-heading">Quest Log</h2>
      </header>
      <div className="quest-board">
        <div className="board-heading">
          <p>Төслүүд</p>
          <div className="quest-progress">
            <span className="progress-meter" aria-hidden="true">
              {portfolio.projects.map(({ id }, index) => <i key={id} className={index < viewed.size ? 'filled' : ''} />)}
            </span>
            <span role="status">{viewed.size}/{portfolio.projects.length} viewed</span>
          </div>
        </div>
        <ul className="quest-list">
          {portfolio.projects.map((project) => {
            const open = expanded === project.id
            const seen = viewed.has(project.id)
            return <li key={project.id}>
              <h3>
                <button type="button" className="quest-row" aria-expanded={open} aria-controls={'quest-' + project.id} onClick={() => toggle(project.id)}>
                  <span className={'quest-check' + (seen ? ' checked' : '')} aria-hidden="true" />
                  <span className="quest-name"><strong>{project.title}</strong><small>{project.category}</small></span>
                  {seen && <span className="sr-only">Үзсэн</span>}
                  <span className="quest-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                </button>
              </h3>
              <div id={'quest-' + project.id} className="quest-detail" hidden={!open}>
                <div className="quest-detail-layout">
                  {open && <ProjectPreview project={project} />}
                  <div>
                    <p>{project.description}</p>
                    <dl><div><dt>Зорилго</dt><dd>{project.goal}</dd></div><div><dt>Миний хийсэн хэсэг</dt><dd>{project.role}</dd></div></dl>
                    <Tags items={project.tools} />
                    {(project.repository || project.demo) && <div className="project-links">
                      {project.repository && <a href={project.repository}>GitHub <span aria-hidden="true">↗</span></a>}
                      {project.demo && <a href={project.demo} target="_blank" rel="noopener">Сайтыг нээх <span aria-hidden="true">↗</span></a>}
                    </div>}
                  </div>
                </div>
              </div>
            </li>
          })}
        </ul>
      </div>
    </div>
  </section>
}

function LearnBadges() {
  const { completedOn, badges } = portfolio.microsoftLearn

  return <section id="badges" className="learn-badges" aria-labelledby="badges-heading">
    <div className="shell section-shell">
      <header className="section-heading">
        <h2 id="badges-heading">Microsoft Learn Badges</h2>
        <p>Модулийн шалгалтуудад тэнцсэн · <time dateTime={completedOn}>{completedOn}</time></p>
      </header>
      <ul className="badge-grid">
        {badges.map(({ icon, title }) => <li className="badge-card" key={icon}>
          <img src={import.meta.env.BASE_URL + 'badges/' + icon + '.png'} alt="" width="64" height="64" loading="lazy" />
          <h3 lang="en">{title}</h3>
        </li>)}
      </ul>
    </div>
  </section>
}

function Contact() {
  const { github, email } = portfolio.contact
  return <section id="contact" className="contact" aria-labelledby="contact-heading">
    <div className="shell section-shell contact-inner">
      <header className="section-heading">
        <p className="eyebrow"><span aria-hidden="true">✦</span> ХОЛБОО БАРИХ</p>
        <h2 id="contact-heading">Contact</h2>
      </header>
      <div className="contact-links">
        <a className="pixel-button" href={github.url}>GitHub <span aria-hidden="true">↗</span></a>
        <span>@{github.label}</span>
        {email && <a className="pixel-button" href={'mailto:' + email}>{email}</a>}
      </div>
    </div>
  </section>
}

function App() {
  return <>
    <a className="skip-link" href="#main">Үндсэн агуулга руу</a>
    <Header />
    <main id="main">
      <div id="home"><Hero /></div>
      <CharacterSelect />
      <QuestLog />
      <LearnBadges />
      <Contact />
    </main>
    <footer><div className="shell footer-inner"><span>{portfolio.siteName}</span><a href="#home">Дээш буцах ↑</a></div></footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)

