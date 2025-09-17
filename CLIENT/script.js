// -- CONSTANTS

const BASE_URL = 'http://localhost:5045';

// -- TYPES

class InvoiceMapper
{
    // -- OPERATIONS

    static toDomain(
        invoice
        )
    {
        return (
            {
                id: invoice.id,
                invoiceNumber: invoice.numero,
                clientName: invoice.cliente,
                invoiceValue: invoice.valor,
                issueDate: invoice.dataEmissao,
                createdAt: invoice.dataCadastro
            }
            );
    }

    // ~~

    static toPersistence(
        invoice
        )
    {
        return (
            {
                numero: invoice.invoiceNumber,
                cliente: invoice.clientName,
                valor: invoice.invoiceValue,
                dataEmissao: invoice.issueDate
            }
            );
    }
}

// ~~

class InvoiceManager
{
    // -- CONSTRUCTOR

    constructor(
        )
    {
        this.invoiceList = [];
        this.sortOrder = '';
        this.searchTerm = '';
        this.locale = 'pt-BR';
        this.initializeEventListeners();
        this.setMaxDateForIssueDate();
        this.loadInvoices();
        this.updateStatistics();
        this.renderInvoiceTable();
    }

    // -- INQUIRIES

    getBaseUrl(
        resource
        )
    {
        return BASE_URL + resource;
    }

    getSortButtonIcon(
        )
    {
        if ( this.sortOrder === 'asc' ) return '<div class="arrow-up-icon w-4 h-4"></div>';
        else if ( this.sortOrder === 'desc' ) return '<div class="arrow-down-icon w-4 h-4"></div>';
        else return '<div class="arrow-up-down-icon w-4 h-4"></div>';
    }

    // ~~

    getFilteredAndSortedInvoiceArray(
        )
    {
        let filteredInvoiceArray = this.invoiceList;

        if ( this.searchTerm )
        {
            filteredInvoiceArray = filteredInvoiceArray.filter(
                ( invoice ) => invoice.clientName.toLowerCase().includes( this.searchTerm )
                    || invoice.invoiceNumber.toLowerCase().includes( this.searchTerm )
                );
        }

        if ( this.sortOrder !== '' )
        {
            filteredInvoiceArray.sort(
                ( firstInvoice, secondInvoice ) =>
                {
                    const comparison = firstInvoice.invoiceValue - secondInvoice.invoiceValue;
    
                    return this.sortOrder === 'asc' ? comparison : -comparison;
                }
                );
        }

        return filteredInvoiceArray;
    }

    // ~~

    loadInvoices(
        )
    {

        try
        {
            $.ajax({
                url: this.getBaseUrl( '/notas' ),
                method: 'GET',
                contentType: 'application/json',
                success: (result) =>
                {
                    for ( let invoice of result )
                    {
                        this.invoiceList.push( InvoiceMapper.toDomain( invoice ) );
                    }

                    this.renderInvoiceTable();
                    this.updateStatistics();
                },
                error: (xhr, status, error) =>
                {
                    console.error("Erro na requisição:", status, error);
                }
            }
            );
        }
        catch ( error )
        {
            console.error( 'Error loading invoices from localStorage:', error );
            this.invoiceList = [];
        }
    }

    // -- OPERATIONS

    initializeEventListeners(
        )
    {
        $( '#invoiceForm' ).on( 'submit', ( event ) => this.handleFormSubmit( event ) );
        $( '#searchInput' ).on( 'input', ( event ) => this.handleSearch( event ) );
        $( '#sortButton' ).on( 'click', () => this.handleSort() );
    }

    // ~~

    setMaxDateForIssueDate(
        )
    {
        const today = new Date();
        const year = today.getFullYear();
        const month = String( today.getMonth() + 1 ).padStart( 2, '0' );
        const day = String( today.getDate() ).padStart( 2, '0' );
        const maxDate = `${ year }-${ month }-${ day }`;

        $( '#issueDate' ).attr( 'max', maxDate );
    }

    // ~~

    handleFormSubmit(
        event
        )
    {
        event.preventDefault();
        
        const formData = this.extractFormData();
        
        if ( this.validateFormData( formData ) )
        {
            const newInvoice = this.createInvoice( formData );
            this.addInvoice( newInvoice );
            this.clearForm();
            this.updateStatistics();
            this.renderInvoiceTable();
        }
    }

    // ~~

    extractFormData(
        )
    {
        return (
            {
                invoiceNumber: $( '#invoiceNumber' ).val().trim(),
                clientName: $( '#clientName' ).val().trim(),
                invoiceValue: parseFloat( $( '#invoiceValue' ).val()) || 0,
                issueDate: $( '#issueDate' ).val()
            }
            );
    }

    // ~~

    validateFormData(
        data
        )
    {
        const errorArray = [];

        if ( !data.invoiceNumber )
        {
            errorArray.push( 'Número da nota é obrigatório' );
        }

        if ( !data.clientName )
        {
            errorArray.push( 'Nome do cliente é obrigatório' );
        }

        if ( !data.invoiceValue || data.invoiceValue <= 0 )
        {
            errorArray.push( 'Valor deve ser maior que zero' );
        }

        if ( !data.issueDate )
        {
            errorArray.push( 'Data de emissão é obrigatória' );
        }
        else
        {
            const issueDate = new Date( data.issueDate );
            const today = new Date();
            today.setHours( 23, 59, 59, 999 );
            
            if ( issueDate > today )
            {
                errorArray.push( 'Data de emissão não pode ser superior a hoje' );
            }
        }

        const existingInvoice = this.invoiceList.find(invoice => 
            invoice.invoiceNumber === data.invoiceNumber
            );
        
        if ( existingInvoice )
        {
            errorArray.push( 'Já existe uma nota fiscal com este número' );
        }

        if ( errorArray.length > 0 )
        {
            alert( errorArray.join( '\n' ) );

            return false;
        }

        return true;
    }

    // ~~

    createInvoice(
        data
        )
    {
        return InvoiceMapper.toPersistence( data );
    }

    // ~~

    addInvoice(
        invoice
        )
    {
        $.ajax(
            {
                url: this.getBaseUrl( '/notas' ),
                method: 'POST',
                data: JSON.stringify( invoice ),
                contentType: 'application/json',
                success: ( result ) =>
                {
                    const created = InvoiceMapper.toDomain( result );
                    this.invoiceList.push( created );
                    this.updateStatistics();
                    this.renderInvoiceTable();
                }
            }
            );
    }

    // ~~

    removeInvoice(
        invoiceId
        )
    {
        this.invoiceList = this.invoiceList.filter( invoice => invoice.id !== invoiceId );
        this.updateStatistics();
        this.renderInvoiceTable();
    }

    // ~~

    handleSearch(
        event
        )
    {
        this.searchTerm = event.target.value.toLowerCase();
        this.renderInvoiceTable();
    }

    // ~~

    handleSort(
        )
    {
        if ( this.sortOrder === 'asc' )
        {
            this.sortOrder = 'desc';
        }
        else if ( this.sortOrder === 'desc' )
        {
            this.sortOrder = '';
        }
        else
        {
            this.sortOrder = 'asc';
        }

        this.updateSortButtonText();
        this.renderInvoiceTable();
    }

    // ~~

    updateSortButtonText(
        )
    {
        $( '#sortButton' ).html(
            this.getSortButtonIcon()
            + 'Ordenar por Valor'
            );
    }

    // ~~

    updateStatistics(
        )
    {
        const totalInvoiceCount = this.invoiceList.length;
        const totalValue = this.invoiceList.reduce(
            ( sum, invoice ) => sum + invoice.invoiceValue,
            0
            );
        const averageValue = totalInvoiceCount > 0
            ? totalValue / totalInvoiceCount
            : 0;

        $( '#totalInvoices' ).text( totalInvoiceCount );
        $( '#totalValue' ).text( this.formatCurrency( totalValue ) );
        $( '#averageValue' ).text( this.formatCurrency( averageValue ) );
    }

    // ~~

    formatCurrency(
        value,
        currency = 'BRL'
        )
    {
        return new Intl.NumberFormat(
            this.locale,
            {
                style: 'currency',
                currency
            }
            ).format( value );
    }

    // ~~

    formatDate(
        dateString,
        )
    {
        const date = new Date( dateString );

        return date.toLocaleDateString( this.locale );
    }

    // ~~

    renderInvoiceTable(
        )
    {
        const filteredInvoiceArray = this.getFilteredAndSortedInvoiceArray();
        const $emptyState = $( '#emptyState' );
        const $invoiceList = $( '#invoiceList' );
        const $recordCount = $( '#recordCount' );

        $recordCount.text( filteredInvoiceArray.length + ' registros' );

        if ( filteredInvoiceArray.length === 0 )
        {
            $emptyState.show();
            $invoiceList.hide();
        }
        else
        {
            $emptyState.hide();
            $invoiceList.show();
            this.renderInvoiceTableRows( filteredInvoiceArray );
        }
    }

    // ~~

    renderInvoiceTableRows(
        invoiceArray
        )
    {
        const $tableBody = $( '#invoiceTableBody' );
        $tableBody.empty();

        for ( let invoice of invoiceArray )
        {
            const row = this.createInvoiceTableRow( invoice );
            $tableBody.append( row );
        }
    }

    // ~~

    createInvoiceTableRow(
        invoice
        )
    {
        return $(`
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${ invoice.invoiceNumber }
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    ${ invoice.clientName }
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                    ${ this.formatCurrency( invoice.invoiceValue ) }
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    ${ invoice.issueDate }
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <button 
                        class="text-red-600 hover:text-red-800 font-medium"
                        onclick="invoiceManager.removeInvoice('${ invoice.id }')"
                    >
                        Excluir
                    </button>
                </td>
            </tr>
        `);
    }

    // ~~

    clearForm(
        )
    {
        $( '#invoiceForm' )[ 0 ].reset();
    }
}

// -- STATEMENTS

$( document ).ready(
    () =>
    {
        window.invoiceManager = new InvoiceManager();
    }
    );
