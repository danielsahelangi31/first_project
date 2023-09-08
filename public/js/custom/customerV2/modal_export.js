$(document).ready(function() {

    var customerType
    var customerGroup
    var bentukUsaha
    var serviceType
    var branch
    var country
    var billingLocation
    var dateFrom 
    var dateTo
    var filter_flag

    $(document).on('change', '#filter_export', function() {
        let filter = $(this).val()
        switch (filter) {
            case 'customer_type':
                $('#customer_type_filter').show();
                $('#customer_group_filter').hide();
                $('#bentuk_usaha_filter').hide();
                $('#service_type_filter').hide();
                $('#branch_filter').hide();
                $('#country_filter').hide();
                $('#billing_location_filter').hide();
                break;
            case 'customer_group':
                $('#customer_type_filter').hide();
                $('#customer_group_filter').show();
                $('#bentuk_usaha_filter').hide();
                $('#service_type_filter').hide();
                $('#branch_filter').hide();
                $('#country_filter').hide();
                $('#billing_location_filter').hide();        
                break;
            case 'bentuk_usaha':
                $('#customer_type_filter').hide();
                $('#customer_group_filter').hide();
                $('#bentuk_usaha_filter').show();
                $('#service_type_filter').hide();
                $('#branch_filter').hide();
                $('#country_filter').hide();
                $('#billing_location_filter').hide();                
                break;
            case 'service_type':
                $('#customer_type_filter').hide();
                $('#customer_group_filter').hide();
                $('#bentuk_usaha_filter').hide();
                $('#service_type_filter').show();
                $('#branch_filter').hide();
                $('#country_filter').hide();
                $('#billing_location_filter').hide();                 
                break;
            case 'branch':
                $('#customer_type_filter').hide()
                $('#customer_group_filter').hide()
                $('#bentuk_usaha_filter').hide()
                $('#service_type_filter').hide()
                $('#branch_filter').show()
                $('#country_filter').hide()
                $('#billing_location_filter').hide()         
                break;
            case 'country':
                $('#customer_type_filter').hide()
                $('#customer_group_filter').hide()
                $('#bentuk_usaha_filter').hide()
                $('#service_type_filter').hide()
                $('#branch_filter').hide()
                $('#country_filter').show()
                $('#billing_location_filter').hide()
                break;
            case 'billing_location':
                $('#customer_type_filter').hide()
                $('#customer_group_filter').hide()
                $('#bentuk_usaha_filter').hide()
                $('#service_type_filter').hide()
                $('#branch_filter').hide()
                $('#country_filter').hide()
                $('#billing_location_filter').show()
                break;
            case '':
                $('#customer_type_filter').hide()
                $('#customer_group_filter').hide()
                $('#bentuk_usaha_filter').hide()
                $('#service_type_filter').hide()
                $('#branch_filter').hide()
                $('#country_filter').hide()
                $('#billing_location_filter').hide()
                break;
            default:
                break;
        }
    });

    $(document).on('click', '#filter_button', function() {
        let filter = $('#filter_export').val()
        switch (filter) {
            case 'customer_type':
                customerType = $('#customer-type').val();
                customerGroup = '';
                bentukUsaha = '';
                serviceType = '';
                branch = '';
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val();
                filter_flag = 1;
                break;
            case 'customer_group':
                customerType = '';
                customerGroup = $('#customer-group-id').val();
                bentukUsaha = '';
                serviceType = '';
                branch = '';
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val();
                filter_flag = 1;
                break;
            case 'bentuk_usaha':
                customerType = '';
                customerGroup = '';
                bentukUsaha = $('#bentuk-usaha-id').val();
                serviceType = '';
                branch = '';
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val();                  
                filter_flag = 1;
                break;
            case 'service_type':                
                customerType = '';
                customerGroup = '';
                bentukUsaha = '';
                serviceType = $('#service-type-id').val();
                branch = '';
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val();
                break;
            case 'branch':
                customerType = '';
                customerGroup = '';
                bentukUsaha = '';
                serviceType = '';
                branch = $('#branch-id').val();
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val();               
                filter_flag = 1;
                break;
            case 'country':
                customerType = '';
                customerGroup = '';
                bentukUsaha = '';
                serviceType = '';
                branch = '';
                country = $('#country-id').val();
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val(); 
                filter_flag = 1;
                break;
            case 'billing_location':
                customerType = '';
                customerGroup = '';
                bentukUsaha = '';
                serviceType = '';
                branch = '';
                country = '';
                billingLocation = $('#billing-location').val();
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val(); 
                filter_flag = 1;
                break;
            case '':
                customerType = '';
                customerGroup = '';
                bentukUsaha = '';
                serviceType = '';
                branch = '';
                country = '';
                billingLocation = '';
                dateFrom = $('#start_date_export').val();
                dateTo = $('#end_date_export').val(); 
                filter_flag = 2;
            default:
                break;
        }


        
        $.ajax({
            url: `/master-customer/create-excel`,
            type: 'get',
            data: {
                customer_type: customerType,
                customer_group: customerGroup,
                bentuk_usaha: bentukUsaha,
                service_type: serviceType,
                branch: branch,
                country_id: country,
                billing_location: billingLocation,
                date_from: dateFormater(dateFrom),
                date_to: dateFormater(dateTo),
                filter_flag: filter_flag
            },
            xhrFields: {
                responseType: "blob"
              },
            success: function(response) {
                console.log(response);
                var url = URL.createObjectURL(response);

                var downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = "master-data-customer.xlsx";
                downloadLink.click();

                URL.revokeObjectURL(url);
            }
        })
    });

    function dateFormater(date = '') {
        
        let newDate = new Date(date);
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();

        let newFormat = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return newFormat;
    };
})