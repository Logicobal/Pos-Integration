jQuery(document).ready(function ($) {
  if ($('.pos-content-area').length > 0) {
    let suqare_connect_btn = $('.pos-content-area .suqare_connect_btn');

    let ajax_url = $('.pos-content-area #ajax_url').val();

    let dumImg = $('.pos-content-area #ajax_url').data('imgdum');

    $.ajax({
      url: ajax_url,
      method: 'POST',
      data: {
        action: 'pos_tokens_connect',
      },
      success: function (response) {
        $('.pos-content-area #square_access_token').val(response);
        console.log(response);
        $('.loading__square_section').hide();
      },
    });

    // $('.loading__square_section').hide();

    suqare_connect_btn.click(function (e) {
      e.preventDefault();

      let square_access_token = $(
        '.pos-content-area #square_access_token'
      ).val();

      if (square_access_token == '') {
        return false;
      }

      $('.loading__square_section').show();

      $.ajax({
        url: ajax_url,
        method: 'POST',
        data: {
          action: 'pos_square_connect',
          square_access_token: square_access_token,
        },

        success: function (data) {
          const parsedData = JSON.parse(data);

          $('.loading__square_section').hide();

          if (parsedData.length > 0) {
            console.log(parsedData);

            let html = '';

            parsedData.forEach(function (item) {
              imgURL = item.image_url.length > 0 ? item.image_url : dumImg;

              html += `
              <div class="square-item">
                <div class="square-item-img">
                    <img src=${imgURL} alt="">
                </div>
                <div class="square-item-content">
                    <h3>${item.item_name}</h3>
                    <p>${item.item_description}</p>
                </div>
              </div>
            `;
            });

            $('.square-item-container').html(html);
            $('.square_import_btn').css('display', 'block');

            // console.log(html);

            /* 
            
            =======================================
              IMPORTING PRODUCTS TO WOOCOMMERCE
            =======================================
          */
            $('.square_import_btn').click(function (e) {
              e.preventDefault();

              $('.loading__square_section').show();

              $.ajax({
                url: ajax_url,
                method: 'POST',
                data: {
                  action: 'pos_square_pos_import',
                },
                success: function (response) {
                  console.log(response);
                  $('.loading__square_section').hide();
                },
              });
            });

            /* 
            ============================================
              END IMPORTING PRODUCTS TO WOOCOMMERCE
            ============================================
          */
          }
        },
      });

      //   alert('Connecting to Square...');
    });
  }
});
