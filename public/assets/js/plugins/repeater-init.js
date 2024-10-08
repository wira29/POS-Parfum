$(function () {
    "use strict";

    // Default
    $(".repeater-default").repeater();

    // Custom Show / Hide Configurations
    $(".file-repeater, .email-repeater").repeater({
        show: function () {
            $(this).slideDown();
        },
        hide: function (remove) {
            if (confirm("Are you sure you want to remove this item?")) {
                $(this).slideUp(remove);
            }
        },
    });
});

var room = 1;

$(document).ready(function () {
    $("#add_click").click(function () {
        $.ajax({
            url: `/admin/units-ajax/`,
            type: "GET",
            success: function (response) {
                education_fields(response.data);
            },
            error: function (xhr) {
                console.log(xhr.responseText);
            },
        });
    });
});
function education_fields(units) {
    room++;
    var objTo = document.getElementById("education_fields");
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "mb-3 removeclass" + room);
    var rdiv = "removeclass" + room;
    var selectHTML = `
    <div class="row">
        <div class="col-sm-4">
            <div class="mb-3">
                <label for="unit_id" class="mb-2">Pilih Satuan <small class="text-danger">*</small></label>
                <select name="unit_id[]" class="form-control" id="unit_id_${room}">
                    <option value="Pilih Satuan">Pilih Satuan</option>`;

    if (units) {
        units.forEach(function (unit) {
            selectHTML += `<option value="${unit.id}">${unit.name}</option>`;
        });
    }

    selectHTML += `
                </select>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="mb-3">
            <label class="d-flex gap-2 align-items-center mb-2" for="image">Total dalam
                satuan terkecil <small class="text-danger">*</small><div data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Masukkan total satuan terkecil dari satuan yang anda pilih. Misal dalam 1 kardus terdapat 12 pcs, maka diisi dengan angka 12, begitupula dengan satuan yang lainnya.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-help-octagon">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M12.802 2.165l5.575 2.389c.48 .206 .863 .589 1.07 1.07l2.388 5.574c.22 .512 .22 1.092 0 1.604l-2.389 5.575c-.206 .48 -.589 .863 -1.07 1.07l-5.574 2.388c-.512 .22 -1.092 .22 -1.604 0l-5.575 -2.389a2.036 2.036 0 0 1 -1.07 -1.07l-2.388 -5.574a2.036 2.036 0 0 1 0 -1.604l2.389 -5.575c.206 -.48 .589 -.863 1.07 -1.07l5.574 -2.388a2.036 2.036 0 0 1 1.604 0z" />
                        <path d="M12 16v.01" />
                        <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                    </svg>
                </div></label>
            <input type="number" class="form-control" id="Age"
            name="quantity_in_small_unit[]" placeholder="10" />
    </div>
        </div>
        <div class="col-sm-3">
            <label for="selling_price" class="mb-2">Harga Jual <small class="text-danger">*</small></label>
            <div class="mb-3">
                <input type="number" name="selling_price[]" id="selling_price" class="form-control" placeholder="10.000">
            </div>
        </div>
        <div class="col-sm-2" style="margin-top: 1.35rem">
            <button class="btn btn-danger" type="button"  onclick="remove_education_fields(${room});">
                <i class="ti ti-minus"></i>
            </button>
        </div>
    </div>`;
    divtest.innerHTML = selectHTML;
    objTo.appendChild(divtest);
}

function remove_education_fields(rdid) {
    $(".removeclass" + rdid).remove();
}
