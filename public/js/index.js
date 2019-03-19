$(document).ready(function() {
  // Scrapes ksl news articles
  $("#scrape").on("click", function() {
    $.ajax({
      url: "/scrape",
      type: "GET"
    })
      .then(function(data) {
        $("#news").empty();
        for (let i = 0; i < data.length; i++) {
          $("#news").append(`
        <div class="row mx-2 py-3 border-top border-bottom text-center">
          <div class="col date">${data[i].date}</div>
          <div class="col title">${data[i].title}</div>
          <div class="col link">
            <a class="save btn btn-sm btn-primary my-1" href="https://www.ksl.com${
              data[i].link
            }" target="_blank">Read More</a>
            <button class="save btn btn-sm btn-success">Save</button>
          </div>
        </div>
      `);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  //Saves article to database
  $("#news").on("click", ".save", function() {
    let article = {
      title: $(this)
        .parent()
        .siblings(".title")
        .text(),
      link: $(this)
        .siblings("a")
        .attr("href"),
      date: $(this)
        .parent()
        .siblings(".date")
        .text()
    };
    console.log(article);
    $.ajax({
      url: "/save",
      type: "POST",
      data: article
    })
      .then(function(data) {})
      .catch(function(err) {
        console.log(err);
      });
  });

  // Retreive saved articles.
  $("#saved").on("click", function() {
    $.ajax({
      url: "/saved",
      type: "GET"
    })
      .then(function(data) {
        $("#news").empty();
        for (let i = 0; i < data.length; i++) {
          $("#news").append(`
        <div id="${
          data[i]._id
        }" class="row mx-2 py-3 border-top border-bottom text-center">
          <div class="col date">${data[i].date}</div>
          <div class="col title">${data[i].title}</div>
          <div class="col link">
            <a class="btn btn-sm btn-primary my-1" href="${
              data[i].link
            }" target="_blank">Read More</a>
            <button class="comment btn btn-sm btn-success">Comments</button>
            <button class="delete btn btn-sm btn-danger my-1">X</button>
          </div>
        </div>
      `);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  // Delete Specific Article.
  $("#news").on("click", ".delete", function() {
    let id = $(this)
      .parent()
      .parent()
      .attr("id");
    $.ajax({
      url: "/delete",
      type: "DELETE",
      data: { id }
    })
      .then(function(data) {
        $("#news").empty();
        for (let i = 0; i < data.length; i++) {
          $("#news").append(`
        <div id="${
          data[i]._id
        }" class="row mx-2 py-3 border-top border-bottom text-center">
          <div class="col date">${data[i].date}</div>
          <div class="col title">${data[i].title}</div>
          <div class="col link">
            <a class="btn btn-sm btn-primary my-1" href="${
              data[i].link
            }" target="_blank">Read More</a>
            <button class="comment btn btn-sm btn-success">Comments</button>
            <button class="delete btn btn-sm btn-danger my-1">X</button>
          </div>
        </div>
      `);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  // display's comments with article title in a modal
  $("#news").on("click", ".comment", function() {
    let id = $(this)
      .parent()
      .parent()
      .attr("id");
    $.ajax({
      url: "/comments",
      type: "POST",
      data: { id }
    })
      .then(function(data) {
        $(".modal-title").html(data.title);
        $("div.modal-body").attr("id", data._id);
        $("#modal-comments").empty();
        for (let i = 0; i < data.comment.length; i++) {
          $("#modal-comments").append(
            `<p class="border-bottom pt-3">
            ${data.comment[i]}
          </p>`
          );
        }
      })
      .catch(function(err) {
        console.log(err);
      });
    $("#myModal").modal("show");
  });
  // Adds a comment into article collection comment array
  $("#add-comment").on("click", function() {
    let newComment = {
      id: $("div.modal-body").attr("id"),
      comment: $("#comment-text").val()
    };
    $.ajax({
      url: "/new-comment",
      type: "POST",
      data: newComment
    })
      .then(function(data) {
        $("#modal-comments").append(
          `<p class="border-bottom pt-3">
            ${newComment.comment}
          </p>`
        );
        $("#comment-text").val("");
      })
      .catch(function(err) {
        console.log(err);
      });
  });
});
