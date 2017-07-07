import Calendar from './calendar';

module PageIssues {
  function setupdEditIssue(): void {
    Calendar.setup([
      {
        wrapper: document.querySelector('#partial-discussion-header') as HTMLDivElement,
        input: document.querySelector('#issue_title') as HTMLInputElement,
        styles: { 
          position: 'absolute',
          top: '2px',
          left: '-40px'
        },
        btnCssRules: [
          '#partial-discussion-header.open .btn-calendar { display:block; }',
          '#partial-discussion-header .btn-calendar { display:none; }'
        ]
      }
    ]);
  }

  function setupdNewIssue(): void {
    const input = document.querySelector('#issue_title') as HTMLInputElement;
    input.style.paddingLeft = '42px';
    Calendar.setup([
      {
        wrapper: document.querySelector('.discussion-topic-header') as HTMLDivElement,
        input,
        styles: { 
          position: 'absolute',
          top: '10px',
          left: '16px'
        },
        btnCssRules: []
      }
    ]);
  }

  export function setup(): void {
    const issueId = location.pathname.split('/')[4]
    if (issueId === 'new') {
      setupdNewIssue();
    } else {
      setupdEditIssue();
    }
  }

  export function destroy(): void {
    // nothing
  }
}
export default PageIssues;