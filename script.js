let userLocation = "";

function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    userLocation = pos.coords.latitude + "," + pos.coords.longitude;
    alert("Location captured");
  });
}

async function submitForm() {
  const data = {
    name: name.value,
    phone: phone.value,
    service: service.value,
    problem: problem.value,
    location: userLocation
  };

  await fetch("/book", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  // WhatsApp message
  let msg = `EV Booking:
Name: ${data.name}
Phone: ${data.phone}
Service: ${data.service}
Problem: ${data.problem}
Location: ${data.location}`;

  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`);
}