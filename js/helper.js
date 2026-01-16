export function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
}

export function handleCircleCollisions(circles) {
  for(let i=0; i<circles.length; i++) {
    for(let j=i+1; j<circles.length; j++) {
      const distance = Math.sqrt((circles[j].x - circles[i].x)**2 + (circles[j].y - circles[i].y)**2);
      if(distance < (circles[i].radius+circles[j].radius)) {
        circles[i].dx *= -1;
        circles[i].dy *= -1;
        circles[j].dx *= -1;
        circles[j].dy *= -1;

        const overlap = (circles[i].radius + circles[j].radius) - distance;
        if(overlap > 0) {
          const normVectorX = (circles[j].x - circles[i].x) / distance;
          const normVectorY = (circles[j].y - circles[i].y) / distance;

          circles[i].x -= normVectorX * overlap/2;
          circles[i].y -= normVectorY * overlap/2;
          circles[j].x += normVectorX * overlap/2;
          circles[j].y += normVectorY * overlap/2;
        }
      }
    }
  }
}

export function checkPlayerCollisions(player, circles) {
  for(let i=circles.length-1; i>=0; i--) {
    const circle = circles[i];
    const distance = Math.sqrt((circle.x - player.x)**2 + (circle.y - player.y)**2);
    if(distance <= circle.radius + player.radius) 
      return i;
  }
  return null;
}

export function  formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}
