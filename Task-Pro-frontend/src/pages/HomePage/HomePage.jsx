import css from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={css.layout}>
      <div className={css.content}>
        <div className={css.main}>
          <p className={css.placeholder}>
            Before starting your project, it is essential{" "}
            <span style={{ color: "var(--accent)" }}>to create a board</span> to
            visualize and track all the necessary tasks and milestones. This
            board serves as a centralized hub for managing your workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
