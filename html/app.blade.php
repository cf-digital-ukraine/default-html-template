<!DOCTYPE html>
<html lang="{{ locale() }}" class="{{ getBodyClasses() }}">
    <head>
        <meta charset="UTF-8">

        @if(($structure->index_follow_tag ?? false) && (!$paginated || settings('seo::index_pagination')))
            {!! $structure->index_follow_tag !!}
        @else
        <meta name="robots" content="noindex, nofollow" />
        @endif

        <base src="{{ url('/') }}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta http-equiv="Content-Type" content="text/html">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="format-detection" content="telephone=no">

        <meta name="HandheldFriendly" content="true">

        <!-- Custom Browsers Color Start -->
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-tap-highlight" content="no">
        <!-- Custom Browsers Color End -->

        <title>@yield('title', $structure->ultimate_meta_title ?? '')</title>
        <meta name="description" content="@yield('description', $structure->ultimate_meta_description ?? '')">

        @if(Route::currentRouteName() != 'homepage')
            <link rel="canonical" href="{{ locale_url(($paginated ?? false) ? ($structure->canonical ?? request()->path()) : request()->path()) }}"/>
        @endif

        @if(isset($paginates) && !settings('seo::canonical_pagination'))
            @foreach($paginates as $type => $paginate)
                @if($paginate)
                    <link rel="{{ $type }}" href="{{ $paginate }}"/>
                @endif
            @endforeach
        @endif

        @include('includes.multilang_alternates')

        <!-- Favicon -->
         <link rel="icon" type="image/x-icon" href="{{ asset('themes/builder/favicon/favicon.ico') }}">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Open Graph -->
        @yield('open_graph')

        <!-- CSS -->
        @yield('before_styles')

        @if(isOldExplorer('10.0'))
            <link rel="stylesheet" href="{{asset('css/old-browser.css')}}">
        @else
            <link rel="stylesheet" href="{{asset('css/main.css')}}">
        @endif

        @yield('after_styles')

        <script type="text/javascript">
            window.site = {
                language: "{{ locale() }}",
                theme: "{{ asset('/') }}".replace(/\/$/, ""),
                url: location.origin+'{{$url ?? ''}}'.replace(/\/$/, ""),
                isSafari : {!! isSafari() ? "true" : "false" !!},
                isExplorer: {!! isOldExplorer('13.0') ? "true" : "false" !!}
            };
        </script>

        <!-- Analytic script head -->
        {!! $analytic_scripts['analytic_script_head'] !!}
    </head>
    @if(isOldExplorer('10.0'))

        <body>
        <!-- Analytic script body begin -->
        {!! $analytic_scripts['analytic_script_body_begin'] !!}

        <div class="old-browser" id="old-browser">
            <div>
                <p>{{ trans('frontend.old browsers.main text') }}</p>
                <a href="https://browsehappy.com/" target="_blank">{{ trans('frontend.old browsers.link text') }}</a>
            </div>
            <img src="{{ asset('img/old-browser.jpg') }}" alt="@yield('title', $structure->ultimate_meta_title ?? '')">
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', function () {

                document.body.style.opacity = "1";
                document.getElementById('old-browser').style.height = window.innerHeight + 'px';
            });
        </script>
        <!-- Analytic script body end -->
        {!! $analytic_scripts['analytic_script_body_end'] !!}
        </body>
    @else
        <body class="@yield('body_class')" style="opacity: 1"> <!--TODO -->

        <!-- Analytic script body begin -->
        {!! $analytic_scripts['analytic_script_body_begin'] !!}

        @include('includes.developer_bar')

        @include('includes.header')

        <main class="@yield('wrapper_class')">

            @include('includes.breadcrumbs')

            @yield('before_content')

            @yield('content')

            @include('ecommerce::includes.modals')
            @yield('after_content')

        </main>

        @include('includes.footer')

        <!-- JavaScript -->
        @yield('before_scripts')
        @stack('scripts')

        @yield('after_scripts')
        @include('includes.svg')

        <!-- Analytic script body end -->
        {!! $analytic_scripts['analytic_script_body_end'] !!}
        </body>
    @endif
</html>
