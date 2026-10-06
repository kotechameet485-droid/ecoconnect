$(document).ready(function () {
    console.log("EcoConnect: jQuery 3.7.1 initialized successfully.");

    const $demoCard = $("#demoCard");
    const $demoTitle = $("#demoTitle");
    const $demoFoodName = $("#demoFoodName");
    const $demoFoodCategory = $("#demoFoodCategory");
    const $donationPreview = $("#donationPreview");
    const $jqueryInstructions = $("#jqueryInstructions");
    const $dynamicList = $("#dynamicDonationList");
    const $itemMessage = $("#itemMessage");

    const $actionButtons = $(".demo-action-btn");
    const $demoCards = $(".eco-demo-card");

    const totalButtonsOnDemo = $("#jquery-demo button").length;
    console.log("Operation 1 (DOM Selection): Total action buttons selected =", totalButtonsOnDemo);

    let isDefaultText = true;
    $("#changeTextBtn").on("click", function () {
        if (isDefaultText) {
            $demoTitle.text("EcoConnect Food Donation – Verified & Ready");
            $("#previewStatusText").text("Priority Redistribution Active");
            $(this).html('<i class="bi bi-arrow-repeat me-1"></i> Reset Text');
            isDefaultText = false;
        } else {
            $demoTitle.text("EcoConnect jQuery DOM Demonstration");
            $("#previewStatusText").text("Ready for Donation");
            $(this).html('<i class="bi bi-fonts me-1"></i> Change Text');
            isDefaultText = true;
        }
        showFeedbackNotification("Operation 2: Text manipulated successfully via .text()");
    });

    let isHtmlFormatted = false;
    $("#changeHtmlBtn").on("click", function () {
        if (!isHtmlFormatted) {
            $("#previewBadgeArea").html(
                '<span class="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-semibold shadow-sm">' +
                '<i class="bi bi-patch-check-fill me-1"></i> <strong>Quality Verified:</strong> Fresh & Safe for Human Consumption</span>'
            );
            $(this).html('<i class="bi bi-arrow-repeat me-1"></i> Reset HTML');
            isHtmlFormatted = true;
        } else {
            $("#previewBadgeArea").html(
                '<span class="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fw-semibold">' +
                '<i class="bi bi-shield me-1"></i> Standard Surplus Inspection Pending</span>'
            );
            $(this).html('<i class="bi bi-code-slash me-1"></i> Format HTML');
            isHtmlFormatted = false;
        }
        showFeedbackNotification("Operation 3: HTML content rendered via .html()");
    });

    let isStyled = false;
    $("#changeCssBtn").on("click", function () {
        if (!isStyled) {
            $demoTitle.css("color", "#1b5e20");

            $donationPreview.css({
                "border-left": "5px solid #2e7d32",
                "background-color": "#f1f8e9",
                "transition": "all 0.3s ease"
            });

            $(this).html('<i class="bi bi-arrow-counterclockwise me-1"></i> Reset Style');
            isStyled = true;
        } else {
            $demoTitle.css("color", "");
            $donationPreview.css({
                "border-left": "",
                "background-color": "",
                "transition": ""
            });

            $(this).html('<i class="bi bi-palette me-1"></i> Style Preview');
            isStyled = false;
        }
        showFeedbackNotification("Operation 4: Inline CSS modified via .css()");
    });

    $("#addHighlightBtn").on("click", function () {
        $demoCard.addClass("jquery-highlight");
        showFeedbackNotification("Operation 5: Class 'jquery-highlight' added via .addClass()");
    });

    $("#removeHighlightBtn").on("click", function () {
        $demoCard.removeClass("jquery-highlight");
        showFeedbackNotification("Operation 6: Class 'jquery-highlight' removed via .removeClass()");
    });

    $("#toggleHighlightBtn").on("click", function () {
        $demoCard.toggleClass("jquery-highlight");
        const hasClass = $demoCard.hasClass("jquery-highlight");
        showFeedbackNotification(
            "Operation 7: Class toggled via .toggleClass() [Highlighted: " + (hasClass ? "Yes" : "No") + "]"
        );
    });

    $("#toggleInstructionsBtn").on("click", function () {
        $jqueryInstructions.slideToggle(300, function () {
            const isVisible = $jqueryInstructions.is(":visible");
            $("#toggleInstructionsBtn").html(
                isVisible
                    ? '<i class="bi bi-eye-slash me-1"></i> Hide Instructions'
                    : '<i class="bi bi-eye me-1"></i> Show Instructions'
            );
        });
        showFeedbackNotification("Operation 8: Display toggled via .slideToggle()");
    });

    function updateLivePreview() {
        const foodNameVal = $demoFoodName.val().trim();
        const categoryVal = $demoFoodCategory.val();

        $("#previewFood").text(foodNameVal || "Not Specified");
        $("#previewCategory").text(categoryVal || "General");

        showFeedbackNotification("Operation 9: Form values retrieved via .val() & updated via .text()");
    }

    $("#updatePreviewBtn").on("click", function () {
        updateLivePreview();
    });

    let donationItemCounter = 0;

    $("#addItemBtn").on("click", function () {
        donationItemCounter++;
        const foodName = $demoFoodName.val().trim() || "Rice";
        const category = $demoFoodCategory.val() || "Grains";
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newItemHtml = `
            <div class="demo-item p-3 mb-2 bg-white rounded border shadow-sm d-flex justify-content-between align-items-center" style="display: none;">
                <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-success rounded-pill px-2 py-1">#${donationItemCounter}</span>
                    <div>
                        <h6 class="mb-0 fw-bold text-success">${escapeHtml(foodName)}</h6>
                        <small class="text-muted"><i class="bi bi-tag me-1"></i>Category: ${escapeHtml(category)} &bull; Added: ${currentTime}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-light text-success border border-success-subtle">Ready</span>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-delete-single-item" title="Remove this item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        $itemMessage.hide();

        const $appendedItem = $(newItemHtml);
        $dynamicList.append($appendedItem);
        $appendedItem.slideDown(250);

        showFeedbackNotification("Operation 10: Item #" + donationItemCounter + " created via .append()");
    });

    $("#removeItemBtn").on("click", function () {
        const $items = $dynamicList.children(".demo-item");

        if ($items.length > 0) {
            const $lastItem = $items.last();
            $lastItem.fadeOut(250, function () {
                $(this).remove();
            });
            showFeedbackNotification("Operation 11: Last item removed via .remove()");
        } else {
            $itemMessage
                .text("No donation items to remove.")
                .stop(true, true)
                .fadeIn(200)
                .delay(2000)
                .fadeOut(400);
        }
    });

    $dynamicList.on("click", ".btn-delete-single-item", function () {
        const $targetItem = $(this).closest(".demo-item");
        $targetItem.fadeOut(200, function () {
            $(this).remove();
            showFeedbackNotification("Single item removed via .remove()");
        });
    });

    $demoFoodName.on("input", function () {
        const currentVal = $(this).val();
        $("#previewFood").text(currentVal || "Rice");
    });

    $demoFoodCategory.on("change", function () {
        const currentCat = $(this).val();
        $("#previewCategory").text(currentCat);
    });

    $("#jqueryDemoForm").on("submit", function (e) {
        e.preventDefault();
        updateLivePreview();
        $("#addItemBtn").trigger("click");
        showFeedbackNotification("Operation 12: Demo Form 'submit' event handled!");
    });

    function showFeedbackNotification(message) {
        let $notification = $("#jqueryFeedbackToast");
        if ($notification.length === 0) {
            $("body").append(
                '<div id="jqueryFeedbackToast" class="jquery-feedback-toast shadow-lg">' +
                '<i class="bi bi-check2-circle me-2 fs-5"></i>' +
                '<span id="jqueryFeedbackText"></span>' +
                '</div>'
            );
            $notification = $("#jqueryFeedbackToast");
        }

        $("#jqueryFeedbackText").text(message);

        $notification
            .stop(true, true)
            .css("display", "flex")
            .hide()
            .fadeIn(200)
            .delay(2200)
            .fadeOut(400);
    }

    if ($(".graph-card").length > 0) {
        if ($("#toggleGraphInfoBtn").length === 0) {
            $(".section-header-wrap").append(
                '<div class="mt-3">' +
                '<button id="toggleGraphInfoBtn" class="btn btn-outline-success btn-sm shadow-sm">' +
                '<i class="bi bi-info-circle me-1"></i> <span id="toggleGraphBtnText">Hide Graph Information</span> (jQuery slideToggle)' +
                '</button>' +
                '</div>'
            );
        }

        let graphsInfoVisible = true;
        $("#toggleGraphInfoBtn").on("click", function () {
            $(".graph-card-body").slideToggle(350, function () {
            });

            graphsInfoVisible = !graphsInfoVisible;
            $("#toggleGraphBtnText").text(
                graphsInfoVisible ? "Hide Graph Information" : "Show Graph Information"
            );
            $(this).find("i").toggleClass("bi-info-circle bi-info-circle-fill");

            showFeedbackNotification("Analytics: Graph information toggled via .slideToggle()");
        });
    }

    function escapeHtml(text) {
        return $("<div>").text(text).html();
    }

});
