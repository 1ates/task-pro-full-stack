import { Link } from "react-router-dom";
import css from "./WelcomePage.module.css";

const WelcomePage = () => {
  return (
    <section className={css.page}>
      <div className={css.content}>
        {/* Hero illustration */}
        <picture className={css.picture}>
          <source
            srcSet="/task-pro/images/welcome-desktop.png 1x, /task-pro/images/welcome-desktop@2x.png 2x"
            media="(min-width: 1440px)"
          />
          <source
            srcSet="/task-pro/images/welcome-tablet.png 1x, /task-pro/images/welcome-tablet@2x.png 2x"
            media="(min-width: 768px)"
          />
          <img
            className={css.illustration}
            srcSet="/task-pro/images/welcome-mobile.png 1x, /task-pro/images/welcome-mobile@2x.png 2x"
            src="/task-pro/images/welcome-desktop.png"
            alt="Task Pro collaborative workspace illustration"
            width={124}
            height={124}
            loading="eager"
          />
        </picture>

        {/* Logo with SVG sprite icon */}
        <h1 className={css.logo}>
          <span className={css.logoIcon}>
            <svg width="20" height="20" aria-hidden="true">
              <use href="/task-pro/images/icons.svg#icon-logo-path1" />
            </svg>
            <svg
              className={css.logoLightning}
              width="12"
              height="12"
              aria-hidden="true"
            >
              <use href="/task-pro/images/icons.svg#icon-logo-path2" />
            </svg>
          </span>
          Task Pro
        </h1>

        {/* Subtitle */}
        <p className={css.subtitle}>
          Supercharge your productivity and take control of your tasks with Task
          Pro — simple, flexible, and powerful.
        </p>

        {/* CTA buttons */}
        <nav className={css.actions} aria-label="Authentication navigation">
          <Link to="/auth/register" className={css.primary} id="welcome-register-btn">
            Registration
          </Link>
          <Link to="/auth/login" className={css.secondary} id="welcome-login-btn">
            Log In
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default WelcomePage;