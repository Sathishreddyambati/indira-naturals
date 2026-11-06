// Opening animation: clean white screen, the logo fills in from left to right,
// then glows (only on the logo shapes) and fades away. Shown once per browser session.
export default function IntroSplash() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('in-intro')){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem('in-intro','1')}}catch(e){}",
        }}
      />
      <div className="intro-splash" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo-sm.png`} alt="" className="intro-logo" />
      </div>
    </>
  );
}
