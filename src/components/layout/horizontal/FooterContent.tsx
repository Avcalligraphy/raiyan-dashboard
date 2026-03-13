// React Router Imports - Note: External links use regular anchor tags

// Third-party Imports
import classnames from "classnames";

// Hook Imports
import useHorizontalNav from "@menu/hooks/useHorizontalNav";

// Util Imports
import { horizontalLayoutClasses } from "@layouts/utils/layoutClasses";

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav();

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.footerContent,
        "flex items-center justify-between flex-wrap gap-4",
      )}
    >
      <p>
        <span className="text-textSecondary">{`© ${new Date().getFullYear()},`}</span>
        <span className="text-black">{` Raiyan Travel`}</span>
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
