import{_ as n,S as o,j as l}from"./index.js";var x=n((s,t)=>{const e=s.append("rect");if(e.attr("x",t.x),e.attr("y",t.y),e.attr("fill",t.fill),e.attr("stroke",t.stroke),e.attr("width",t.width),e.attr("height",t.height),t.name&&e.attr("name",t.name),t.rx&&e.attr("rx",t.rx),t.ry&&e.attr("ry",t.ry),t.attrs!==void 0)for(const r in t.attrs)e.attr(r,t.attrs[r]);return t.class&&e.attr("class",t.class),e},"drawRect"),d=n((s,t)=>{const e={x:t.startx,y:t.starty,width:t.stopx-t.startx,height:t.stopy-t.starty,fill:t.fill,stroke:t.stroke,class:"rect"};x(s,e).lower()},"drawBackgroundRect"),g=n((s,t)=>{const e=t.text.replace(o," "),r=s.append("text");r.attr("x",t.x),r.attr("y",t.y),r.attr("class","legend"),r.style("text-anchor",t.anchor),t.class&&r.attr("class",t.class);const a=r.append("tspan");return a.attr("x",t.x+t.textMargin*2),a.text(e),r},"drawText"),h=n((s,t,e,r)=>{const a=s.append("image");a.attr("x",t),a.attr("y",e);const i=l.sanitizeUrl(r);a.attr("xlink:href",i)},"drawImage"),m=n((s,t,e,r)=>{const a=s.append("use");a.attr("x",t),a.attr("y",e);const i=l.sanitizeUrl(r);a.attr("xlink:href",`#${i}`)},"drawEmbeddedImage"),y=n(()=>({x:0,y:0,width:100,height:100,fill:"#EDF2AE",stroke:"#666",anchor:"start",rx:0,ry:0}),"getNoteRect"),p=n(()=>({x:0,y:0,width:100,height:100,"text-anchor":"start",style:"#666",textMargin:0,rx:0,ry:0,tspan:!0}),"getTextObj");export{d as a,p as b,m as c,x as d,h as e,g as f,y as g};
