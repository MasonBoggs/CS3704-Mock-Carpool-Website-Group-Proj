// Open the modal
function openModal() {
    document.getElementById("myModal").style.display = "block";
}

// Close the modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Handle form submission and add new ride to the list
document.getElementById("postRideForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form from refreshing the page

    // Get form data
    const driverName = document.getElementById("driverName").value;
    const rideFrom = document.getElementById("rideFrom").value;
    const rideTo = document.getElementById("rideTo").value;
    const ridePrice = document.getElementById("ridePrice").value;

    // Create a new ride post element
    const ridePost = document.createElement("div");
    ridePost.classList.add("ride-post");
    ridePost.setAttribute("data-driver", driverName);
    ridePost.setAttribute("data-price", ridePrice);
    ridePost.setAttribute("data-rating", "4.5");  // Default rating for new rides (can be changed)

    // Add the ride details
    ridePost.innerHTML = `
        <p><strong>Driver:</strong> ${driverName}</p>
        <p><strong>From:</strong> ${rideFrom}</p>
        <p><strong>To:</strong> ${rideTo}</p>
        <p><strong>Price:</strong> $${ridePrice}</p>
        <button class="btn">Request Ride</button>
        <button class="btn report-btn">Report</button>
        <button class="btn block-btn">Block</button>
    `;

    // Append the new ride to the rides container
    document.getElementById("ridesContainer").appendChild(ridePost);

    // Close the modal
    closeModal();
});

// Function to apply filters
function applyFilters() {
    const driverFilter = document.getElementById("driverFilter").value.toLowerCase();
    const ratingFilter = parseFloat(document.getElementById("ratingFilter").value);
    const priceFilter = parseFloat(document.getElementById("priceFilter").value);

    const ridePosts = document.querySelectorAll(".ride-post");

    ridePosts.forEach(function(ridePost) {
        const driverName = ridePost.getAttribute("data-driver").toLowerCase();
        const rating = parseFloat(ridePost.getAttribute("data-rating"));
        const price = parseFloat(ridePost.getAttribute("data-price"));

        let matches = true;

        // Filter by driver name
        if (driverFilter && !driverName.includes(driverFilter)) {
            matches = false;
        }

        // Filter by rating
        if (ratingFilter && rating < ratingFilter) {
            matches = false;
        }

        // Filter by price
        if (priceFilter && price > priceFilter) {
            matches = false;
        }

        // Show or hide ride post based on matches
        ridePost.style.display = matches ? "block" : "none";
    });
}
