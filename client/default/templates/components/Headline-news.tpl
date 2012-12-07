<section id="headline-news">
    <h1>Headline News</h1>

    <ul id="headlines">
        <% _.each(newsItems, function(newsItem) { %>
            <li>
                <div class="video-preview">
                    <img src="img/VideoPlaceholder.png" alt="Headline 1">
                    <div class="title"><%= newsItem.videoCaption %></div>
                </div>

                <h2><%= newsItem.headline %></h2>
                <p><%= newsItem.text %></p>
                <a class="more" href="#">More &raquo;</a>
            </li>
        <% }); %>
    </ul>
    <button id="load-more-news">Load More News</button>
</section>