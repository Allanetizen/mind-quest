import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { Landing } from "./pages/Landing";
import { Quiz } from "./pages/Quiz";
import { PetSelection } from "./pages/PetSelection";
import { Auth } from "./pages/Auth";
import { Journal } from "./pages/Journal";
import { FirstJournal } from "./pages/FirstJournal";

/** Shareable quiz path – use this URL to send someone directly to the mood/companion quiz. */
export const QUIZ_PATH = "/quiz";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Landing },
      { path: "quiz", Component: Quiz },
      { path: "choose-pet", Component: PetSelection },
      { path: "auth", Component: Auth },
      { path: "first-journal", Component: FirstJournal },
      { path: "journal", Component: Journal },
    ],
  },
]);