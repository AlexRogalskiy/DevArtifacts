$bg: #ECF0C9;
$label: #334D5C;
$p1: #45B29D;
$p2: #E27A3F;
$p3: #DF5A49;
$p4: #EFC94C;

body {
  margin:0;
  height:100vh;
  width:100vw;
  font-size:5vh;
  font-family:sans-serif;
  background:$bg;
  font-weight:bold;
  color:mix($bg,$p1,70%);
}

p {
  margin:0;
}

.container {
  display:flex;
  height:100vh;
  width:100vw;
}

.round {
  flex:1;
  display:flex;
  flex-direction:column;
  opacity:.5;
  &.completed {
    opacity:1;
  }
  &:last-child {
    .bracket:after {
      display:none;
    }
    .player:after {
      display:none;
    }
  }
  &:first-child {
    .player:before {
       display:none;
    }
  }
}

.bracket {
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  padding: 0 40px;
  position:relative;
  &:after {
    content:"";
    display:block;
    position:absolute;
    top:25%;
    right:0;
    height: 50%;
    width:2px;
    background:$label;
  }
}

.player {
  background:$p1;
  flex:1;
  flex:0 0 7vh;
  position:relative;
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 0 10px;
  &.winner {
    background:$p3;
    color:$label;
  }
  
  &.loser {
    background:$p3;
    opacity:.5;
  }
  &:before {
    content:"";
    display:block;
    height:2px;
    width:40px;
    background:$label;
    position:absolute;
    left:-40px;
    top: 50%;
  }
  &:after {
    content:"";
    display:block;
    height:2px;
    width:40px;
    background:$label;
    position:absolute;
    right:-40px;
    top: 50%;
  }
}