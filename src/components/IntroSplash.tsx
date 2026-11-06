// Opening animation: the logo fills in from left to right, then a band of light
// sweeps across its letters (only the logo shines, not a box), then the screen fades away.
// Shown once per browser session.
export default function IntroSplash() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const logo = `${base}/images/logo-sm.png`;
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('in-intro')){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem('in-intro','1')}}catch(e){}",
        }}
      />
      <div className="intro-splash" aria-hidden>
        <span
          className="shine-logo intro-logo"
          style={{ ["--shine-mask" as string]: `url('${logo}')`, ["--shine-delay" as string]: "2s", ["--shine-duration" as string]: "1.2s" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" />
          <span className="shine-sweep" />
        </span>
      </div>
    </>
  );
}
