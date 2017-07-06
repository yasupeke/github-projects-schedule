import PageProjects from './page_projects';
import PageIssues from './page_issues';


const PAGE_PROJECTS = 'projects';
const PAGE_ISSUES = 'issues';

const page = location.pathname.split('/')[3]

switch(page) {
  case PAGE_PROJECTS:
    console.log('projects');
    PageProjects();
  break;
  case PAGE_ISSUES:
    console.log('issues');
    PageIssues();
  break;
  default:
    console.log('スルーwww', location.pathname, location.pathname.split('/'));
  break;
}