class Stepper {
    constructor(totalSteps, component) {
        this.total = totalSteps;
        this.currentStepper = 0;
    }

    totalSteps() {
        return this.total;
    }

    action(componentId) {
        let currentStepper = 0;

        function updateStepper() {
            $(`${componentId}`).carousel(currentStepper);
            $("#btn-next").css("display", currentStepper == totalSteps - 1 ? "none" : "block");
            $("#btn-back").css("display", currentStepper == 0 ? "none" : "block");
        }

        $("#btn-back").css("display", currentStepper == 0 ? "none" : "block");

        $('#btn-next').click(function() {
            if(currentStepper < totalSteps) {
                currentStepper += 1;
                updateStepper();
            };
        })

        $('#btn-back').click(function() {
            if(currentStepper < totalSteps) {
                currentStepper -= 1;
                updateStepper();
            };
        })

        for (let i = 1; i <= totalSteps; i++) {
            $(`#ball-step-${i}`).click(function() {
                currentStepper = i - 1;
                updateStepper();
            });
        }
    }
}