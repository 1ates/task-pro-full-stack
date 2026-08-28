import { Link } from "react-router-dom";
import { Icon } from "../../components/Icon/Icon";
import css from "./WelcomePage.module.css";

const WelcomePage = () => {
  return (
    <section className={css.page}>
      <div className={css.content}>
        <picture className={css.picture}>
          <source
            srcSet='/task-pro/images/welcome-desktop.png 1x, /task-pro/images/welcome-desktop@2x.png 2x'
            media='(min-width: 1440px)'
          />
          <source
            srcSet='/task-pro/images/welcome-tablet.png 1x, /task-pro/images/welcome-tablet@2x.png 2x'
            media='(min-width: 768px)'
          />
          <img
            className={css.illustration}
            srcSet='/task-pro/images/welcome-mobile.png 1x, /task-pro/images/welcome-mobile@2x.png 2x'
            src='/task-pro/images/welcome-desktop.png'
            alt='Task Pro collaborative workspace illustration'
            width={124}
            height={124}
            loading='eager'
          />
        </picture>

        <h1 className={css.logo}>
          <span className={css.logoIcon}>
            <Icon name='icon-logo' />
          </span>
          Task Pro
        </h1>

        <p className={css.subtitle}>
          Supercharge your productivity and take control of your tasks with Task Pro — simple, flexible, and powerful.
          Don&apos;t wait, start achieving your goals now!
        </p>

        <nav className={css.actions} aria-label='Authentication navigation'>
          <Link to='/auth/register' className={css.primary} id='welcome-register-btn'>
            Registration
          </Link>
          <Link to='/auth/login' className={css.secondary} id='welcome-login-btn'>
            Log In
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default WelcomePage;
