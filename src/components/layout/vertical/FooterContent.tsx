// React Router Imports

// Third-party Imports
import classnames from "classnames";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Util Imports
import { verticalLayoutClasses } from "@layouts/utils/layoutClasses";

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav();

  return (
    <div
      className={classnames(
        verticalLayoutClasses.footerContent,
        "flex items-center justify-between flex-wrap gap-4",
      )}
    >
      <p>
        <span className="text-textSecondary">{`© ${new Date().getFullYear()},`}</span>
        <span className="text-primary">{` Raiyan Travel`}</span>
        <span className="text-textSecondary">{`. All rights reserved.`}</span>
      </p>
      {!isBreakpointReached && (
        <div className="flex items-center gap-4">
          <a
            href="https://themeforest.net/licenses/standard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Contact Relations Manager
          </a>
        </div>
      )}
    </div>
  );
};

export default FooterContent;
