import PageProjects from './page_projects';
import PageIssues from './page_issues';
import Calendar from './calendar';


const PAGE_PROJECTS = 'projects';
const PAGE_ISSUES = 'issues';

const observerConfig = {
  childList: true,
  attributes: false,
  characterData: false,
  subtree: false,
  attributeOldValue: false,
  characterDataOldValue: false
};

const observer = new MutationObserver(onMutationListener);

let currentPage = '';

observer.observe(document.querySelector('#js-repo-pjax-container') as Node, observerConfig);
setup(getCurrentPage());

function setup(page: string): void {
  switch (page) {
    case PAGE_PROJECTS:
      PageProjects.setup();
      break;
    case PAGE_ISSUES:
      PageIssues.setup();
      break;
    default:
      // nothing
      break;
  }
  currentPage = page;
}

function getCurrentPage(): string {
  return location.pathname.split('/')[3];
}

function onMutationListener(mutations: MutationRecord[], observer: MutationObserver): void {
  mutations.forEach((mutation) => {
    if (mutation.type !== 'childList') return;
    if (mutation.addedNodes.length === 0) return;
    switch (currentPage) {
      case PAGE_PROJECTS:
        PageProjects.destroy();
        break;
      case PAGE_ISSUES:
        PageIssues.destroy();
        break;
      default:
        // nothing
        break;
    }
    Calendar.destory();
    setup(getCurrentPage());
  });
}