$(document).ready(function(){
    //stepper button
    $("#ball-step-1").click(function() {
        carouselVal = 0
        $("#carouselVendor").carousel(0);
        $('#kembali').css('display', 'none');
        $("#selanjutnya").css('display', '');
    })

    $("#ball-step-2").click(function() {
        carouselVal = 1
        $("#carouselVendor").carousel(1); 
        $("#kembali").css('display', 'block');
        $("#selanjutnya").css('display', '');
    })

    $("#ball-step-3").click(function() {
        carouselVal = 2
        $("#carouselVendor").carousel(2); 
        $('#selanjutnya').css('display', 'none');
        $("#kembali").css('display', 'block');
    })

    $("#ball-step-4").click(function() {
        carouselVal = 3
        $("#carouselVendor").carousel(3); 
        $('#selanjutnya').css('display', 'none');
        $("#kembali").css('display', 'block');
    })

    //batal
    $('#batal').click(function() {
        window.location.assign(`/master-vendor`);
    });

    var carouselVal = 0;
    // kembali
    $("#kembali").click(function() {
        if(carouselVal === 1) {
        carouselVal -= 1
        $("#carouselVendor").carousel(0); 
        $(this).css('display', 'none');
        } else if (carouselVal === 2) {
        carouselVal -= 1
        $("#carouselVendor").carousel(1); 
        $("#selanjutnya").css('display', '');
        } else if (carouselVal === 3) {
        carouselVal -= 1
        $("#carouselVendor").carousel(2);
        $("#selanjutnya").css('display', '');
        } else if (carouselVal === 4) {
        carouselVal -= 1
        $("#carouselVendor").carousel(3); 
        $("#selanjutnya").css('display', '');
        }
    });

    // next
    $("#selanjutnya").click(function() {
        if(carouselVal === 0) {
            carouselVal += 1;
            $("#carouselVendor").carousel(1); 
            $("#kembali").css('display', 'block');
        } else if(carouselVal === 1) {
            carouselVal += 1;
            $("#carouselVendor").carousel(2); 
        } else if(carouselVal === 2) {
            carouselVal += 1;
            $("#carouselVendor").carousel(3); 
        } else if(carouselVal === 3) {
            carouselVal += 1;
            $("#carouselVendor").carousel(4); 
            $(this).css('display', 'none');
        }
    });


})