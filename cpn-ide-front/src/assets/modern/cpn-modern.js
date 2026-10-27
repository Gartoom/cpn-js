/* Modified distribution, 2026-10-27. Licensed under AGPL-3.0; see LICENSE. */
/* DOM decoration only. CPN IDE's Angular handlers and simulator API are unchanged. */
(()=>{
  let scheduled=false, toolbarObserver;
  const readable=n=>(n.querySelector('span')?.textContent||n.textContent||'').trim();
  const mark=(el,key,value)=>{if(el.getAttribute(key)!==value)el.setAttribute(key,value);};
  const activateTab=tab=>{tab.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}));if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}};
  function decorate(){
    scheduled=false;
    const toolbar=document.querySelector('app-main-toolbar>nav');
    if(!toolbar)return;
    mark(toolbar,'aria-label','Project actions');
    if(!toolbar.querySelector('.cpn-source')){
      const item=document.createElement('li');item.className='nav-item cpn-source';
      const link=document.createElement('a');link.className='nav-link';
      link.href='assets/modern/source-license.html';link.target='_blank';link.rel='noopener';
      link.textContent='Source / license';item.appendChild(link);toolbar.querySelector('ul').appendChild(item);
    }
    toolbar.querySelectorAll('div.nav-link').forEach(el=>{
      const label=readable(el);
      mark(el,'role','button');mark(el,'tabindex','0');mark(el,'aria-label',label);mark(el,'title',label);
      el.classList.toggle('cpn-primary',label==='Start simulation');
      el.classList.toggle('cpn-stop',label==='Stop simulation');
      el.classList.toggle('cpn-save',label==='Save project');
    });
    document.querySelectorAll('nav.navbar-sm a').forEach(el=>{
      if(!el.textContent.trim()) {
        const name=el.title||(el.querySelector('.fa-arrow-up')?'Move up':el.querySelector('.fa-arrow-down')?'Move down':null);
        if(name)mark(el,'aria-label',name);
      }
    });
    document.querySelectorAll('nav input[placeholder="Filter"]').forEach(el=>mark(el,'aria-label','Filter items'));
    document.querySelectorAll('li.tabs__tab').forEach(el=>mark(el,'title',el.textContent.trim()));
    document.querySelectorAll('tabs.cpn-tabs').forEach((tabs,groupIndex)=>{
      const list=tabs.querySelector('ul.tabs__tab-bar');
      if(!list)return;
      mark(list,'role','tablist');
      const panels=tabs.querySelectorAll(':scope>div>tab');
      Array.from(list.children).filter(n=>n.matches('li.tabs__tab')).forEach((tab,index)=>{
        const id='cpn-tab-'+groupIndex+'-'+index;
        mark(tab,'id',id);mark(tab,'role','tab');
        mark(tab,'aria-selected',String(tab.classList.contains('active')));
        mark(tab,'tabindex',tab.classList.contains('active')?'0':'-1');
        if(panels[index]){
          mark(panels[index],'id',id+'-panel');mark(panels[index],'role','tabpanel');
          mark(panels[index],'aria-labelledby',id);mark(tab,'aria-controls',id+'-panel');
        }
      });
    });
    document.querySelectorAll('nav i.fas,nav i.far').forEach(el=>mark(el,'aria-hidden','true'));
    if(!document.querySelector('.cpn-panel-switches')) {
      const group=document.createElement('div');group.className='cpn-panel-switches';
      group.setAttribute('aria-label','Workspace panels');
      for(const [panel,label] of [['project','Project'],['inspector','Inspector']]){
        const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.panel=panel;b.setAttribute('aria-expanded','false');
        b.addEventListener('click',()=>{
          const open=document.body.dataset.cpnPanel===panel?'':panel;
          document.body.dataset.cpnPanel=open;
          group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-expanded',String(n.dataset.panel===open)));
          window.dispatchEvent(new Event('resize'));
        });group.appendChild(b);
      }
      toolbar.insertBefore(group,toolbar.querySelector('ul'));
    }
    let status=toolbar.querySelector('.cpn-status');
    if(!status){status=document.createElement('output');status.className='cpn-status';status.setAttribute('aria-label','Simulation state');status.setAttribute('aria-live','polite');toolbar.insertBefore(status,toolbar.querySelector('ul'));}
    const state=Array.from(document.querySelectorAll('app-project-tree .tree>app-tree-node>.child>.node')).map(n=>n.textContent.trim()).filter(s=>/^(Step|Time):/.test(s)).join(' · ');
    if(status.textContent!==state)status.textContent=state;
    if(!toolbarObserver){toolbarObserver=new ResizeObserver(()=>{
      document.documentElement.style.setProperty('--cpn-toolbar-height',Math.ceil(toolbar.getBoundingClientRect().height)+'px');
    });toolbarObserver.observe(toolbar);}
  }
  document.addEventListener('keydown',e=>{
    const tab=e.target.closest('li.tabs__tab[role="tab"]');
    if(tab){
      const siblings=Array.from(tab.parentElement.children).filter(n=>n.matches('li.tabs__tab'));
      let index=siblings.indexOf(tab), next;
      if(e.key==='ArrowRight')next=(index+1)%siblings.length;
      if(e.key==='ArrowLeft')next=(index+siblings.length-1)%siblings.length;
      if(e.key==='Home')next=0;
      if(e.key==='End')next=siblings.length-1;
      if(next!==undefined){e.preventDefault();e.stopPropagation();activateTab(siblings[next]);siblings[next].focus();siblings[next].scrollIntoView({block:'nearest',inline:'nearest'});}
      if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();activateTab(tab);}
    }
    const el=e.target.closest('app-main-toolbar div.nav-link[role="button"]');
    if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(!el.classList.contains('disabled'))el.click();}
    if(e.key==='Escape'&&document.body.dataset.cpnPanel){
      document.body.dataset.cpnPanel='';
      document.querySelectorAll('.cpn-panel-switches button').forEach(b=>b.setAttribute('aria-expanded','false'));
      window.dispatchEvent(new Event('resize'));
    }
  },true);
  document.addEventListener('click',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}});
  document.addEventListener('dblclick',e=>{
    if(e.target.closest('app-project-tree-page-node')&&document.body.dataset.cpnPanel==='project')requestAnimationFrame(()=>{
      document.body.dataset.cpnPanel='';
      document.querySelectorAll('.cpn-panel-switches button').forEach(b=>b.setAttribute('aria-expanded','false'));
      window.dispatchEvent(new Event('resize'));
    });
  });
  new MutationObserver(records=>{
    // Diagram animation, console output and code editing do not change toolbar semantics.
    const relevant=records.some(record=>{
      const target=record.target.nodeType===1?record.target:record.target.parentElement;
      return target&&!target.closest('svg,.logConsole,.CodeMirror,.cpn-status');
    });
    if(relevant&&!scheduled){scheduled=true;requestAnimationFrame(decorate);}
  }).observe(document.documentElement,{childList:true,characterData:true,subtree:true});
  decorate();
})();
